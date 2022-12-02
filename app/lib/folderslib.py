import os
from typing import Any
from concurrent.futures import ThreadPoolExecutor

from app.db.sqlite.tracks import SQLiteTrackMethods
from app.db.store import Store

from app.models import Folder, Track
from app.settings import SUPPORTED_FILES

find_tracks_by_filepath = SQLiteTrackMethods.find_tracks_by_filepath
get_all_tracks = SQLiteTrackMethods.get_all_tracks_raw


class getFnF:
    """
    Get files and folders from a directory.
    """

    def __init__(self, path: str) -> None:
        self.path = path

    def __call__(self) -> tuple[Track | Any, Folder | Any]:
        try:
            entries = os.scandir(self.path)
        except FileNotFoundError:
            return ([], [])

        dirs, files = [], []

        for entry in entries:
            ext = os.path.splitext(entry.name)[1].lower()

            if entry.is_dir() and not entry.name.startswith("."):
                dirs.append(entry.path)
            elif entry.is_file() and ext in SUPPORTED_FILES:
                files.append(entry.path)

        tracks = Store.get_tracks_by_filepaths(files)

        with ThreadPoolExecutor(max_workers=30) as pool:
            iterable = pool.map(Store.get_folder, dirs)
            folders = [i for i in iterable if i is not None]

        folders = filter(lambda f: f.has_tracks, folders)

        return (tracks, folders)
