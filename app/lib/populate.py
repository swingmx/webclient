from app import settings
from app.db.sqlite.albums import SQLiteAlbumMethods
from app.db.sqlite.search import SearchMethods as search
from app.db.sqlite.tracks import SQLiteTrackMethods
from app.lib.albumslib import create_album
from app.lib.taglib import get_tags
from app.logger import log
from app.models import Album, Track
from app.utils import UseBisection, run_fast_scandir

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
        tagged_tracks = []
        tagged_count = 0

        for file in untagged:
            tags = get_tags(file)

            if tags is not None:
                tagged_tracks.append(tags)
                tagged_count += 1
            else:
                log.warning("Could not read file: %s", file)

        if len(tagged_tracks) > 0:
            if settings.USE_SQLITE:
                insert_many_tracks(tagged_tracks)

        log.info("Added %s/%s tracks", tagged_count, len(untagged))
        search.load_tracks()


class CreateAlbums:
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

        albums = self.create_albums(tracks)
        insert_many_albums(albums)

        log.info("Albums processed.")

        search.load_albums()

    def create_albums(self, tracks: list[Track]):
        for ahash in self.hashes:
            yield self.create_album(tracks, ahash)

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
            Album(**album)  # test if album dict is valid
            del album["id"]
            return album
        except KeyError:
            print("KeyError when creating album")
            print(album)
