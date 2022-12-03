"""
This module contains functions for the server
"""
import os
import time
from concurrent.futures import ThreadPoolExecutor
import requests
from io import BytesIO
from PIL import Image
from pathlib import Path

from tqdm import tqdm

from app import settings, utils
from app.db.store import Store
from app.lib import watchdoge
from app.lib.colorlib import ProcessAlbumColors, ProcessArtistColors
from app.lib.populate import CreateAlbums, Populate
from app.logger import get_logger
from app.models import Artist

log = get_logger()


@utils.background
def run_secondary_checks():
    """
    Checks for new songs every 5 minutes.
    """
    # ValidateAlbumThumbs()
    # ValidatePlaylistThumbs()

    while True:
        # trackslib.validate_tracks()

        Populate()
        CreateAlbums()
        ProcessAlbumColors()
        ProcessArtistColors()

        if utils.Ping()():
            CheckArtistImages()

        time.sleep(300)


@utils.background
def start_watchdog():
    """
    Starts the file watcher.
    """
    watchdoge.watch.run()


def get_artist_image_link(artist: str):
    """
    Returns an artist image url.
    """

    try:
        url = f"https://api.deezer.com/search/artist?q={artist}"
        response = requests.get(url, timeout=30)
        data = response.json()

        return data["data"][0]["picture_big"]
    except requests.exceptions.ConnectionError:
        time.sleep(5)
        return None
    except (IndexError, KeyError):
        return None


class useImageDownloader:
    def __init__(self, url: str, dest: str) -> None:
        self.url = url
        self.dest = dest

    def download(self) -> bool:
        """
        Downloads the image from the url and saves it to the destination
        """
        try:
            img = Image.open(BytesIO(requests.get(self.url, timeout=30).content))
            img.save(self.dest, format="webp")
            img.close()
            return True
        except requests.exceptions.ConnectionError:
            time.sleep(5)
            return False


class CheckArtistImages:
    @staticmethod
    def download_image(artist: Artist):
        """
        Checks if an artist image exists and downloads it if not.

        :param artistname: The artist name
        """
        img_path = settings.APP_DIR + "/images/artists/" + artist.artisthash + ".webp"
        img_path = Path(img_path)

        if img_path.exists():
            return

        url = get_artist_image_link(artist.name)

        if url is not None:
            return useImageDownloader(url, dest=str(img_path)).download()

    def __init__(self):
        with ThreadPoolExecutor() as pool:
            results = list(
                tqdm(
                    pool.map(self.download_image, Store.artists),
                    total=len(Store.artists),
                    desc="Downloading artist images",
                )
            )
            [i for i in results]


# def fetch_album_bio(title: str, albumartist: str) -> str | None:
#     """
#     Returns the album bio for a given album.
#     """
#     last_fm_url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key={}&artist={}&album={}&format=json".format(
#         settings.LAST_FM_API_KEY, albumartist, title
#     )

#     try:
#         response = requests.get(last_fm_url)
#         data = response.json()
#     except:
#         return None

#     try:
#         bio = data["album"]["wiki"]["summary"].split('<a href="https://www.last.fm/')[0]
#     except KeyError:
#         bio = None

#     return bio


# class FetchAlbumBio:
#     """
#     Returns the album bio for a given album.
#     """

#     def __init__(self, title: str, albumartist: str):
#         self.title = title
#         self.albumartist = albumartist

#     def __call__(self):
#         return fetch_album_bio(self.title, self.albumartist)
