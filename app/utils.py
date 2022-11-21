"""
This module contains mini functions for the server.
"""
import os
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Callable, Dict, List, Set

import requests

from app import instances, models
from app.settings import SUPPORTED_DIR_IMAGES, SUPPORTED_FILES


def background(func):
    """
    a threading decorator
    use @background above the function you want to run in the background
    """

    def background_func(*a, **kw):
        threading.Thread(target=func, args=a, kwargs=kw).start()

    return background_func


def run_fast_scandir(__dir: str, full=False) -> tuple[List[str], List[str]]:
    """
    Scans a directory for files with a specific extension. Returns a list of files and folders in the directory.
    """

    subfolders = []
    files = []

    for f in os.scandir(__dir):
        if f.is_dir() and not f.name.startswith("."):
            subfolders.append(f.path)
        if f.is_file():
            ext = os.path.splitext(f.name)[1].lower()
            if ext in SUPPORTED_FILES:
                files.append(f.path)

    if full or len(files) == 0:
        for _dir in list(subfolders):
            sf, f = run_fast_scandir(_dir, full=True)
            subfolders.extend(sf)
            files.extend(f)

    return subfolders, files


class RemoveDuplicates:
    def __init__(self, tracklist: List[models.Track]) -> None:
        self.tracklist = tracklist

    def __call__(self) -> List[models.Track]:
        hashes = []
        [
            hashes.append(t.trackhash)
            for t in self.tracklist
            if t.trackhash not in hashes
        ]
        tracks = UseBisection(self.tracklist, "trackhash", hashes)()

        return tracks


def is_valid_file(filename: str) -> bool:
    """
    Checks if a file is valid. Returns True if it is, False if it isn't.
    """

    if filename.endswith(".flac") or filename.endswith(".mp3"):
        return True
    else:
        return False


def create_hash(*args: str) -> str:
    """
    Creates a simple hash for an album
    """
    string = "".join(str(a) for a in args).replace(" ", "")
    return "".join([i for i in string if (i.isalnum() or i == "•")]).lower()


def create_new_date():
    """
    It creates a new date and time string in the format of "YYYY-MM-DD HH:MM:SS"
    :return: A string of the current date and time.
    """
    now = datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")


def create_safe_name(name: str) -> str:
    """
    Creates a url-safe name from a name.
    """
    if name is None:
        return "None"

    return "".join([str(i) for i in name if i.isalnum()]).lower()


class UseBisection:
    """
    Uses bisection to find a list of items in another list.

    returns a list of found items with `None` items being not found
    items.
    """

    def __init__(self, source: List, search_from: str, queries: List[str]) -> None:
        self.source_list = source
        self.queries_list = queries
        self.attr = search_from
        self.source_list.sort(key=lambda x: getattr(x, search_from))

    def find(self, query: str):
        left = 0
        right = len(self.source_list) - 1

        while left <= right:
            mid = (left + right) // 2
            if self.source_list[mid].__getattribute__(self.attr) == query:
                return self.source_list[mid]
            elif self.source_list[mid].__getattribute__(self.attr) > query:
                right = mid - 1
            else:
                left = mid + 1

        return None

    def __call__(self) -> List:
        if len(self.source_list) == 0:
            print("empty source list")
            return [None]

        return [self.find(query) for query in self.queries_list]


class Get:
    @staticmethod
    def get_all_tracks() -> List[models.Track]:
        """
        Returns all tracks
        """
        t = instances.tracks_instance.get_all_tracks()
        return [models.Track(**t) for t in t]

    def get_all_albums() -> List[models.Album]:
        """
        Returns all albums
        """
        a = instances.album_instance.get_all_albums()
        return [models.Album(a) for a in a]

    @classmethod
    def get_all_artists(cls) -> Set[str]:
        tracks = cls.get_all_tracks()
        artists: Set[str] = set()

        for track in tracks:
            for artist in track.artist:
                artists.add(artist)

        return artists

    @staticmethod
    def get_all_playlists() -> List[models.Playlist]:
        """
        Returns all playlists
        """
        p = instances.playlist_instance.get_all_playlists()
        return [models.Playlist(p) for p in p]


class Ping:
    """Checks if there is a connection to the internet by pinging google.com"""

    @staticmethod
    def __call__() -> bool:
        try:
            requests.get("https://google.com", timeout=10)
            return True
        except (requests.exceptions.ConnectionError, requests.Timeout):
            return False


def get_normal_artist_name(artists: List[str]) -> str:
    """
    Returns the artist name with most capital letters.
    """
    if len(artists) == 1:
        return artists[0]

    artists.sort()
    return artists[0]


def get_artist_lists(artists: List[str]) -> List[str]:
    """
    Takes in a list of artists and returns a list of lists of an artist's various name variations.

    Example:
    >>> get_artist_lists(['Juice WRLD', 'Juice Wrld', 'XXXtentacion', 'XXXTENTACION'])

    >>> [['Juice WRLD', 'Juice Wrld'], ['XXXtentacion', 'XXXTENTACION']]
    """
    artist_lists: List[List[str]] = []

    for artist in artists:
        for list in artist_lists:
            if artist.lower() == list[0].lower():
                list.append(artist)
                break
        else:
            artist_lists.append([artist])

    return artist_lists


def get_normalized_artists(names: List[str]) -> List[models.Artist]:
    """
    Takes a list of artist names, normalizes them, and returns a list of `Artist` objects

    :param names: List[str]
    :type names: List[str]
    :return: A list of Artist objects.
    """
    names = [n.strip() for n in names]
    names = get_artist_lists(names)
    names = [get_normal_artist_name(a) for a in names]

    return [models.Artist(a) for a in names]


def use_threads(list: list, fn: Callable):
    """
    "Use threads to execute a function on a list of items."

    The function takes two arguments:

    - list: a list of items to execute the function on
    - fn: the function to execute

    The function returns a list of the results of executing the function on each item in the list

    :param list: list - the list of items to be processed
    :type list: list
    :param fn: The function to be called
    :type fn: Callable
    :return: A list of the results of the function fn applied to each element of the list.
    """
    with ThreadPoolExecutor() as pool:
        iter = pool.map(fn, list)
        return [i for i in iter]


def find_best_image(filepaths: List[str]) -> str:
    """
    Finds the best folder image in a list of images.
    """
    for entry in SUPPORTED_DIR_IMAGES:
        for f in filepaths:
            if entry in f.lower():
                return f


def str_bisection(src: list[str], query: str):
    """
    Uses bisection to find a string in a list of strings.

    returns a list of found items with `None` items being not found
    items.
    """
    left = 0
    right = len(src) - 1

    while left <= right:
        mid = (left + right) // 2
        if src[mid] == query:
            return src[mid]
        elif src[mid] > query:
            right = mid - 1
        else:
            left = mid + 1

    return None
