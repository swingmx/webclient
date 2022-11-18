from dataclasses import dataclass

from app import settings
from app.db.sqlite.albums import fetch_all_albums, save_albums
from app.db.sqlite.tracks import fetch_all_tracks, save_tracks
from app.lib.albumslib import create_album
from app.lib.taglib import get_tags
from app.logger import log
from app.models import Album, Track
from app.utils import UseBisection, run_fast_scandir


class Populate:
    """
    Populates the database with all songs in the music directory

    checks if the song is in the database, if not, it adds it
    also checks if the album art exists in the image path, if not tries to extract it.
    """

    def __init__(self) -> None:
        tracks = fetch_all_tracks()
        tracks = [t for t in tracks]

        files = run_fast_scandir(settings.HOME_DIR, full=True)[1]

        untagged = self.filter_untagged(tracks, files)

        if len(untagged) == 0:
            log.info("All clear, no untagged files.")
            return

        self.tag_untagged(untagged)

    @staticmethod
    def filter_untagged(tracks: list[Track], files: list[str]):
        tagged_files = [t.filepath for t in tracks]
        return set(files) - set(tagged_files)

    @staticmethod
    def tag_untagged(untagged: list[str]):
        log.info("Tagging untagged tracks...")

        tagged_tracks = []
        tagged_count = 0

        for file in untagged:
            tags = get_tags(file)

            if tags is not None:
                tagged_tracks.append(tags)
                tagged_count += 1
            else:
                log.warning(f"Could not read: {file}")

        log.info(f"Found {len(tagged_tracks)} untagged tracks.")

        if len(tagged_tracks) > 0:
            if settings.USE_SQLITE:
                save_tracks(tagged_tracks)

        log.info(f"Tagged {tagged_count}/{len(tagged_tracks)} tracks.")


class CreateAlbums:
    def __init__(self) -> None:
        tracks = fetch_all_tracks()
        albums = fetch_all_albums()

        tracks = [t for t in tracks]
        albums = [a for a in albums]

        log.info("Processing albums ...")

        unprocessed_hashes = self.get_unprocessed(albums, tracks)
        log.info(f"Found {len(unprocessed_hashes)} unprocessed albums.")

        if len(unprocessed_hashes) == 0:
            return

        self.hashes = unprocessed_hashes

        albums = self.create_albums(tracks)
        save_albums(albums)
        log.info("Albums processed.")

    def create_albums(self, tracks: list[Track]):
        for h in self.hashes:
            yield self.create_album(tracks, h)

    @staticmethod
    def get_unprocessed(albums: list[Album], tracks: list[Track]) -> list[str]:
        track_album_hashes = set(t.albumhash for t in tracks)
        processed_hashes = set(a.albumhash for a in albums)

        unprocessed_hashes = list(track_album_hashes - processed_hashes)

        return unprocessed_hashes

    @staticmethod
    def create_album(tracks: list[Track], album_hash: str) -> dict:

        album = {"image": None}

        while album["image"] is None:
            track = UseBisection(tracks, "albumhash", [album_hash])()[0]

            if track is not None:
                album = create_album(track)
            else:
                album["image"] = album_hash + ".webp"

        try:
            del album["image"]
            a = Album(**album)  # test if album dict is valid
            del album["id"]
            return album
        except KeyError:
            print("KeyError when creating album")
            print(album)
