"""
In memory store.
"""
import random
from pathlib import Path

from tqdm import tqdm

from app.db.sqlite.tracks import SQLiteTrackMethods as tdb
from app.db.sqlite.albums import SQLiteAlbumMethods as adb
from app.models import Album, Artist, Folder, Track
from app.utils import UseBisection, create_hash


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
    def check_has_tracks(cls, path: str):
        path_hash = create_hash(path)
        tracks = [create_hash(f.path) for f in cls.folders]

        tracks_hash = "".join(tracks)
        return path_hash in tracks_hash

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

        for folder in tqdm(all_folders, desc="Processing folders"):
            path = Path(folder)

            folder = Folder(
                name=path.name,
                path=str(path),
                is_sym=path.is_symlink(),
                has_tracks=True,
                path_token_count=len(path.parts),
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
            path_token_count=len(path.parts),
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

    # ====================================================
    # ==================== ALBUMS ========================
    # ====================================================

    @classmethod
    def load_albums(cls):
        """
        Loads all albums from the database into the store.
        """
        cls.albums = list(adb.get_all_albums())

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
    def get_album_by_albumartist(
        cls, artisthash: str, limit: int, exclude: str
    ) -> list[Album]:
        """
        Returns all albums by the given albumartist.
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
        album = UseBisection(cls.albums, "albumhash", [albumhash])()[0]
        return album

    # ====================================================
    # ==================== ARTISTS =======================
    # ====================================================

    @classmethod
    def load_artists(cls):
        """
        Loads all artists from the database into the store.
        """
        artists = set()

        master_artist_list = [t.artist for t in Store.tracks]
        artists = artists.union(*master_artist_list)

        cls.artists = [Artist(a) for a in artists]
