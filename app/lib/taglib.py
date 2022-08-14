from concurrent.futures import ThreadPoolExecutor
import os
from io import BytesIO
from pprint import pprint

import mutagen
from app import settings
from mutagen.flac import FLAC, MutagenError
from mutagen.id3 import ID3
from PIL import Image, UnidentifiedImageError

from app.helpers import create_hash
from ..models import Track


def parse_album_art(filepath: str):
    """
    Returns the album art for a given audio file.
    """

    if filepath.endswith(".flac"):
        try:
            audio = FLAC(filepath)
            return audio.pictures[0].data
        except:
            return None
    elif filepath.endswith(".mp3"):
        try:
            audio = ID3(filepath)
            return audio.getall("APIC")[0].data
        except:
            return None


def extract_thumb(filepath: str, webp_path: str) -> bool:
    """
    Extracts the thumbnail from an audio file. Returns the path to the thumbnail.
    """
    img_path = os.path.join(settings.THUMBS_PATH, webp_path)
    tsize = settings.THUMB_SIZE

    if os.path.exists(img_path):
        img_size = os.path.getsize(filepath)

        if img_size > 0:
            return True

    album_art = parse_album_art(filepath)

    if album_art is not None:
        try:
            img = Image.open(BytesIO(album_art))
        except UnidentifiedImageError:
            return False

        try:
            small_img = img.resize((tsize, tsize), Image.ANTIALIAS)
            small_img.save(img_path, format="webp")
        except OSError:
            try:
                png = img.convert("RGB")
                small_img = png.resize((tsize, tsize), Image.ANTIALIAS)
                small_img.save(webp_path, format="webp")
            except:
                return False

        return True
    else:
        return False


def get_tags(fullpath: str) -> dict | None:
    """
    Returns a dictionary of tags for a given file.
    """
    try:
        tags = mutagen.File(fullpath, easy=True)
    except MutagenError:
        return None

    def parse_tag(data: list[str | int]):
        [tag, default] = data[:2]

        try:
            is_int = data[2]
        except IndexError:
            is_int = False

        try:
            data = str(tags[tag][0])

            if is_int:
                data = int(data)
        except (KeyError, IndexError, ValueError):
            data = default

        return {tag: data}

    props = [
        ["artist", None],
        ["title", None],
        ["album", None],
        ["albumartist", None],
        ["genre", None],
        ["date", None],
        ["tracknumber", 1, True],
        ["discnumber", 1, True],
        ["copyright", None],
    ]

    data = {}

    with ThreadPoolExecutor() as pool:
        iter = pool.map(parse_tag, props)
        for i in iter:
            data = {**data, **i}

    hash = create_hash(data["artist"], data["album"], data["title"])
    data["hash"] = hash
    data["filepath"] = fullpath
    data["length"] = round(tags.info.length)
    data["bitrate"] = round(int(tags.info.bitrate) / 1000)
    data["folder"] = os.path.dirname(fullpath)
    data["albumhash"] = create_hash(data["album"], data["albumartist"])

    try:
        data["discnumber"] = int(data["discnumber"])
    except ValueError:
        data["discnumber"]

    if data["artist"] == "":
        data["artist"] = data["albumartist"]

    return data
