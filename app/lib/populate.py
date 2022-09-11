import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from typing import List

from app import instances
from app import settings
from app.utils import Get
from app.utils import run_fast_scandir
from app.utils import UseBisection
from app.instances import tracks_instance
from app.lib.albumslib import create_album
from app.lib.taglib import get_tags
from app.logger import logg
from app.models import Album
from app.models import Track
from tqdm import tqdm


class Populate:
    """
    Populate the database with all songs in the music directory

    checks if the song is in the database, if not, it adds it
    also checks if the album art exists in the image path, if not tries to
    extract it.
    """

    def __init__(self) -> None:
        self.db_tracks = []
        self.tagged_tracks = []

        self.files = run_fast_scandir(settings.HOME_DIR, full=True)[1]
        self.db_tracks = tracks_instance.get_all_tracks()

        self.check_untagged()
        self.tag_untagged()

    def check_untagged(self):
        """
        Loops through all the tracks in db tracks removing each
        from the list of tagged tracks if it exists.
        We will now only have untagged tracks left in `files`.
        """
        for track in tqdm(self.db_tracks, desc="Checking untagged"):
            if track["filepath"] in self.files:
                self.files.remove(track["filepath"])

    def get_tags(self, file: str):
        tags = get_tags(file)

        if tags is not None:
            self.tagged_tracks.append(tags)

    def tag_untagged(self):
        """
        Loops through all the untagged files and tags them.
        """

        logg.info("Tagging untagged tracks...")

        for file in self.files:
            self.get_tags(file)

        if len(self.tagged_tracks) > 0:
            tracks_instance.insert_many(self.tagged_tracks)

        logg.info(f"Tagged {len(self.tagged_tracks)} tracks.")


@dataclass
class PreAlbum:
    title: str
    artist: str
    hash: str


class CreateAlbums:
    def __init__(self) -> None:
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

        if len(albums) > 0:
            instances.album_instance.insert_many(albums)

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
