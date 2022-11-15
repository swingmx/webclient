from tqdm import tqdm
from typing import List
from dataclasses import dataclass

from app import settings

from app.lib.taglib import get_tags
from app.lib.albumslib import create_album

from app.db.sqlite.albums import save_albums
from app.db.sqlite.tracks import fetch_all_tracks, save_tracks

from app.instances import tracks_instance
from app.logger import logg
from app.models import Album, Track
from app.utils import Get, UseBisection, run_fast_scandir


class Populate:
    """
    Populate the database with all songs in the music directory

    checks if the song is in the database, if not, it adds it
    also checks if the album art exists in the image path, if not tries to
    extract it.
    """

    def __init__(self) -> None:
        self.db_tracks = []
        # self.tagged_tracks = []

        self.files = run_fast_scandir(settings.HOME_DIR, full=True)[1]
        self.db_tracks = tracks_instance.get_all_tracks()

        self.filter_untagged()
        self.tag_untagged()

    def filter_untagged(self):
        """
        Loops through all the tracks in db tracks removing each
        from the list of tagged tracks if it exists.
        We will now only have untagged tracks left in `files`.
        """
        for track in tqdm(self.db_tracks, desc="Checking untagged"):
            if track["filepath"] in self.files:
                self.files.remove(track["filepath"])

    def tag_untagged(self):
        """
        Loops through all the untagged files and tags them.
        """

        logg.info("Tagging untagged tracks...")

        tagged_tracks = []
        tagged_count = 0

        for file in self.files:
            tags = get_tags(file)

            if tags is not None:
                tagged_tracks.append(tags)
                tagged_count += 1
            else:
                logg.warning(f"Could not read: {file}")

        logg.info(f"Found {len(tagged_tracks)} untagged tracks.")

        if len(tagged_tracks) > 0:
            if settings.USE_SQLITE:
                save_tracks(tagged_tracks)
            # tracks_instance.insert_many(tagged_tracks)

        logg.info(f"Tagged {tagged_count}/{len(tagged_tracks)} tracks.")


@dataclass
class PreAlbum:
    title: str
    artist: str
    hash: str


class CreateAlbums:
    def __init__(self) -> None:
        fetch_all_tracks()
        self.db_tracks = Get.get_all_tracks()
        self.db_albums = Get.get_all_albums()

        prealbums = self.create_pre_albums(self.db_tracks)
        prealbums = self.filter_processed(self.db_albums, prealbums)

        if len(prealbums) == 0:
            return

        albums = []

        for album in tqdm(prealbums, desc="Creating albums"):
            a = self.create_album(album)

            if a is not None:
                albums.append(a)

        print(len(albums))
        if len(albums) > 0:
            if settings.USE_SQLITE:
                save_albums(albums)
            # instances.album_instance.insert_many(albums)

    @staticmethod
    def create_pre_albums(tracks: List[Track]) -> List[PreAlbum]:
        all_hashes = []

        for track in tqdm(tracks, desc="Creating prealbums"):
            hash = track.albumhash

            if hash not in all_hashes:
                all_hashes.append(hash)

        return all_hashes

    def filter_processed(
        self, albums: List[Album], all_album_hashes: List[str]
    ) -> List[dict]:
        to_process = []

        for hash in tqdm(all_album_hashes, desc="Filtering processed albums"):
            album = UseBisection(albums, "hash", [hash])()[0]

            if album is None:
                to_process.append(hash)

        return to_process

    def create_album(self, album_hash: str) -> Album:
        print("wtf")

        album = {"image": None}

        while album["image"] is None:
            track = UseBisection(self.db_tracks, "albumhash", [album_hash])()[0]

            if track is not None:
                album = create_album(track)
                self.db_tracks.remove(track)
            else:
                album["image"] = album_hash + ".webp"

        try:
            album = Album(album)
            return album
        except KeyError:
            print("KeyError when creating album")
            print(album)
