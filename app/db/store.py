"""
In memory store.
"""
import json
import random
from pathlib import Path

from tqdm import tqdm

from app.db.sqlite.albums import SQLiteAlbumMethods as aldb
from app.db.sqlite.artists import SQLiteArtistMethods as ardb
from app.db.sqlite.tracks import SQLiteTrackMethods as tdb
from app.models import Album, Artist, Folder, Track
from app.utils import (UseBisection, create_hash, get_all_artists,
                       get_path_hash, remove_duplicates)


class Store:
    """
    This class holds all tracks in memory and provides methods for
    interacting with them.
    """

    tracks: list[Track] = []
    folders: list[Folder] = []
    albums: list[Album] = []
    artists: list[Artist] = []

    @classmethod
    def load_all_tracks(cls):
        """
        Loads all tracks from the database into the store.
        """

        cls.tracks = list(tdb.get_all_tracks())

    @classmethod
    def add_track(cls, track: Track):
        """
        Adds a single track to the store.
        """

        cls.tracks.append(track)

    @classmethod
    def add_tracks(cls, tracks: list[Track]):
        """
        Adds multiple tracks to the store.
        """

        cls.tracks.extend(tracks)

    @classmethod
    def check_has_tracks(cls, path: str):  # type: ignore
        """
        Checks if a folder has tracks.
        """
        path_hash = get_path_hash(path)
        tracks_hash = "".join(f.path_hash for f in cls.folders)

        return path_hash in tracks_hash

    @staticmethod
    def create_folder(path: str) -> Folder:
        """
        Creates a folder object from a path.
        """
        folder = Path(path)

        return Folder(
            name=folder.name,
            path=str(folder),
            is_sym=folder.is_symlink(),
            has_tracks=True,
            path_hash=create_hash(*folder.parts[1:]),
        )

    @classmethod
    def add_folder(cls, path: str):
        """
        Adds a folder to the store.
        """

        if cls.check_has_tracks(path):
            return

        folder = cls.create_folder(path)
        cls.folders.append(folder)

    @classmethod
    def process_folders(cls):
        """
        Creates a list of folders from the tracks in the store.
        """
        all_folders = [track.folder for track in cls.tracks]
        all_folders = set(all_folders)

        all_folders = [folder for folder in all_folders if folder not in cls.folders]

        all_folders = [Path(f) for f in all_folders]
        all_folders = [f for f in all_folders if f.exists()]

        for path in tqdm(all_folders, desc="Processing folders"):
            folder = Folder(
                name=path.name,
                path=str(path),
                is_sym=path.is_symlink(),
                has_tracks=True,
                path_hash=create_hash(*path.parts[1:]),
            )

            cls.folders.append(folder)

    @classmethod
    def get_folder(cls, path: str):  # type: ignore
        """
        Returns a folder object by its path.
        """
        folder = UseBisection(cls.folders, "path", [path])()[0]

        if folder is not None:
            return folder

        has_tracks = cls.check_has_tracks(path)

        if not has_tracks:
            return None

        path: Path = Path(path)  # type: ignore

        folder = Folder(
            name=path.name,
            path=str(path),
            is_sym=path.is_symlink(),
            has_tracks=True,
        )
        cls.folders.append(folder)
        return folder

    @classmethod
    def get_tracks_by_filepaths(cls, paths: list[str]) -> list[Track]:
        """
        Returns all tracks matching the given paths.
        """
        tracks = UseBisection(cls.tracks, "filepath", paths)()
        return [track for track in tracks if track is not None]

    @classmethod
    def get_tracks_by_albumhash(cls, album_hash: str) -> list[Track]:
        """
        Returns all tracks matching the given album hash.
        """
        return [t for t in cls.tracks if t.albumhash == album_hash]

    @classmethod
    def get_tracks_by_artist(cls, artisthash: str) -> list[Track]:
        """
        Returns all tracks matching the given artist.
        """
        tracks = [t for t in cls.tracks if artisthash in t.artist_hashes]
        return remove_duplicates(tracks)

    # ====================================================
    # ==================== ALBUMS ========================
    # ====================================================

    @classmethod
    def load_albums(cls):
        """
        Loads all albums from the database into the store.
        """
        cls.albums = list(aldb.get_all_albums())

    @classmethod
    def add_album(cls, album: Album):
        """
        Adds an album to the store.
        """
        cls.albums.append(album)

    @classmethod
    def add_albums(cls, albums: list[Album]):
        """
        Adds multiple albums to the store.
        """
        cls.albums.extend(albums)

    @classmethod
    def map_album_color(cls, albumhash: str, colors: list[str]):
        """
        Maps a color tuple to an album.
        """
        album = UseBisection(cls.albums, "albumhash", [albumhash])()[0]
        album.colors = colors

    @classmethod
    def get_albums_by_albumartist(
        cls, artisthash: str, limit: int, exclude: str
    ) -> list[Album]:
        """
        Returns N albums by the given albumartist, excluding the specified album.
        """
        artisthash = f"-{artisthash}-"

        albums = [album for album in cls.albums if artisthash in album.albumartisthash]

        albums = [album for album in albums if album.albumhash != exclude]

        if len(albums) > limit:
            random.shuffle(albums)

        return albums[:limit]

    @classmethod
    def get_album_by_hash(cls, albumhash: str) -> Album:
        """
        Returns an album by its hash.
        """
        return UseBisection(cls.albums, "albumhash", [albumhash])()[0]

    @classmethod
    def get_albums_by_artist(cls, artist: str) -> list[Album]:
        """
        Returns all albums by the given artist.
        """
        return [
            album
            for album in cls.albums
            if f"-{create_hash(artist)}-" in album.albumartisthash
        ]

    # ====================================================
    # ==================== ARTISTS =======================
    # ====================================================

    @classmethod
    def load_artists(cls):
        """
        Loads all artists from the database into the store.
        """
        cls.artists = get_all_artists(cls.tracks, cls.albums)

        db_artists: list[tuple] = list(ardb.get_all_artists())

        for art in tqdm(db_artists, desc="Loading artists"):
            cls.map_artist_color(art)

    @classmethod
    def map_artist_color(cls, artist_tuple: tuple):
        """
        Maps a color to the corresponding artist.
        """
        artist: Artist = UseBisection(cls.artists, "artisthash", [artist_tuple[1]])()[0]

        if artist is not None:
            artist.colors = json.loads(artist_tuple[2])

    @classmethod
    def add_artist(cls, artist: Artist):
        """
        Adds an artist to the store.
        """
        cls.artists.append(artist)

    @classmethod
    def add_artists(cls, artists: list[Artist]):
        """
        Adds multiple artists to the store.
        """
        for artist in artists:
            if artist not in cls.artists:
                cls.artists.append(artist)

    @classmethod
    def get_artist_by_hash(cls, artisthash: str) -> Artist:
        """
        Returns an artist by its hash.
        """
        artist = UseBisection(cls.artists, "artisthash", [artisthash])()[0]
        return artist
