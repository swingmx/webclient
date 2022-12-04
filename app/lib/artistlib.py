from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import time
import requests
from PIL import Image

from tqdm import tqdm

from app import settings
from app.models import Artist
from app.db.store import Store


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


class DownloadImage:
    def __init__(self, url: str, name: str) -> None:
        sm_path = Path(settings.ARTIST_IMG_SM_PATH) / name
        lg_path = Path(settings.ARTIST_IMG_LG_PATH) / name

        img = self.download(url)

        if img is not None:
            self.save_img(img, sm_path, lg_path)

    @staticmethod
    def download(url: str) -> Image.Image | None:
        """
        Downloads the image from the url.
        """
        try:
            return Image.open(BytesIO(requests.get(url, timeout=30).content))
        except requests.exceptions.ConnectionError:
            return None

    @staticmethod
    def save_img(img: Image.Image, sm_path: Path, lg_path: Path):
        """
        Saves the image to the destinations.
        """
        img.save(lg_path, format="webp")

        sm_size = settings.SM_ARTIST_IMG_SIZE
        img.resize((sm_size, sm_size), Image.ANTIALIAS).save(sm_path, format="webp")


class CheckArtistImages:
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

    @staticmethod
    def download_image(artist: Artist):
        """
        Checks if an artist image exists and downloads it if not.

        :param artistname: The artist name
        """
        img_path = Path(settings.ARTIST_IMG_SM_PATH) / f"{artist.artisthash}.webp"

        if img_path.exists():
            return

        url = get_artist_image_link(artist.name)

        if url is not None:
            return DownloadImage(url, name=f"{artist.artisthash}.webp")


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
