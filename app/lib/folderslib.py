import os
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from typing import Any

from app.db.sqlite.tracks import SQLiteTrackMethods
from app.models import Folder, Track
from app.settings import SUPPORTED_FILES

find_tracks_by_filepath = SQLiteTrackMethods.find_tracks_by_filepath
get_folder_count = SQLiteTrackMethods.get_folder_count


@dataclass
class Dir:
    path: str
    is_sym: bool


def create_folder(_dir: Dir) -> Folder:
    """Create a single Folder object"""
    folder = {
        "name": _dir.path.split("/")[-1],
        "path": _dir.path,
        "is_sym": _dir.is_sym,
        "trackcount": get_folder_count(_dir.path),
    }

    return Folder(folder)


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
                dirr = {
                    "path": entry.path,
                    "is_sym": entry.is_symlink(),
                }
                dirs.append(Dir(**dirr))
            elif entry.is_file() and ext in SUPPORTED_FILES:
                files.append(entry.path)

        tracks = find_tracks_by_filepath(files)
        tracks = list(tracks)

        with ThreadPoolExecutor() as pool:
            iterable = pool.map(create_folder, dirs)
            folders = [i for i in iterable if i is not None]

        folders = filter(lambda f: f.trackcount > 0, folders)

        return (tracks, folders)
