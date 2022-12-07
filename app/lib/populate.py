from tqdm import tqdm

from app import settings
from app.db.sqlite.albums import SQLiteAlbumMethods
from app.db.sqlite.tracks import SQLiteTrackMethods
from app.db.store import Store
from app.lib.albumslib import create_album
from app.lib.taglib import get_tags
from app.logger import log
from app.models import Album, Artist, Track
from app.utils import UseBisection, get_artists_from_tracks, run_fast_scandir

get_all_tracks = SQLiteTrackMethods.get_all_tracks
insert_many_tracks = SQLiteTrackMethods.insert_many_tracks

get_all_albums = SQLiteAlbumMethods.get_all_albums
insert_many_albums = SQLiteAlbumMethods.insert_many_albums


class Populate:
    """
    Populates the database with all songs in the music directory

    checks if the song is in the database, if not, it adds it
    also checks if the album art exists in the image path, if not tries to extract it.
    """

    def __init__(self) -> None:

        tracks = get_all_tracks()
        tracks = list(tracks)

        files = run_fast_scandir(settings.HOME_DIR, full=True)[1]

        untagged = self.filter_untagged(tracks, files)

        if len(untagged) == 0:
            log.info("All clear, no unread files.")
            return

        self.tag_untagged(untagged)

    @staticmethod
    def filter_untagged(tracks: list[Track], files: list[str]):
        tagged_files = [t.filepath for t in tracks]
        return set(files) - set(tagged_files)

    @staticmethod
    def tag_untagged(untagged: set[str]):
        log.info("Found %s new tracks", len(untagged))
        tagged_tracks: list[dict] = []
        tagged_count = 0

        for file in tqdm(untagged, desc="Reading files"):
            tags = get_tags(file)

            if tags is not None:
                tagged_tracks.append(tags)

                Store.add_track(Track(**tags))
                Store.add_folder(tags["folder"])

                tagged_count += 1
            else:
                log.warning("Could not read file: %s", file)

        if len(tagged_tracks) > 0:
            insert_many_tracks(tagged_tracks)
            tracks = [Track(**t) for t in tagged_tracks]

            artists = get_artists_from_tracks(tracks)
            Store.add_artists([Artist(a) for a in artists])

        log.info("Added %s/%s tracks", tagged_count, len(untagged))


class CreateAlbums:
    """
    Creates album objects from tracks, saves them to db and adds them to the store.
    """

    def __init__(self) -> None:
        tracks = get_all_tracks()
        albums = get_all_albums()

        tracks = list(tracks)
        albums = list(albums)  # type: ignore

        log.info("Processing albums ...")

        unprocessed_hashes = self.get_unprocessed(albums, tracks)
        log.info("Found %s unprocessed albums", len(unprocessed_hashes))

        if len(unprocessed_hashes) == 0:
            return

        self.hashes = unprocessed_hashes

        gen = self.create_albums(tracks)
        albums_dicts = [a for a in gen if a is not None]

        # Store.add_albums([Album(**a) for a in albums_dicts])
        insert_many_albums(albums_dicts)

        log.info("Albums processed.")

    def create_albums(self, tracks: list[Track]):
        for ahash in tqdm(self.hashes, desc="Creating albums"):
            album_dict = self.create_album(tracks, ahash)

            if album_dict is not None:
                album = Album(**album_dict)
                Store.add_album(album)

                for artist in album.albumartists:  # type: ignore
                    artist: Artist
                    store_artist = Store.get_artist_by_hash(artist.artisthash)

                    if store_artist is None:
                        Store.add_artist(artist)

                yield album_dict

    @staticmethod
    def get_unprocessed(albums: list[Album], tracks: list[Track]) -> list[str]:
        track_album_hashes = set(t.albumhash for t in tracks)
        processed_hashes = set(a.albumhash for a in albums)

        unprocessed_hashes = list(track_album_hashes - processed_hashes)

        return unprocessed_hashes

    @staticmethod
    def create_album(tracks: list[Track], album_hash: str) -> dict | None:
        album = {"image": None}

        while album["image"] is None:
            track = UseBisection(tracks, "albumhash", [album_hash])()[0]

            if track is not None:
                album = create_album(track)
                tracks.remove(track)
            else:
                album["image"] = album_hash + ".webp"  # type: ignore

        try:
            del album["image"]
            return album
        except KeyError:
            print("KeyError when creating album")
            print(album)
