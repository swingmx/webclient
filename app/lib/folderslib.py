import os
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from typing import Any

from app.db.sqlite.tracks import SQLiteTrackMethods

# from app.db.sqlite.search import SearchMethods as db
from app import settings
from app.models import Folder, Track
from app.settings import SUPPORTED_FILES
from app.db.store import Store

# from app.utils import create_hash

find_tracks_by_filepath = SQLiteTrackMethods.find_tracks_by_filepath
get_all_tracks = SQLiteTrackMethods.get_all_tracks_raw


@dataclass
class Dir:
    path: str
    is_sym: bool


def get_folder_count(path: str):
    """
    Returns the number of tracks in the given folder.
    """
    # path_hash = create_hash(path)
    # tracks = get_all_tracks()

    # for t in tracks:
    #     print(t)
    # print(tracks[0][11])
    # tracks = [create_hash(track[11]) for track in tracks]
    # tracks = [track for track in tracks if track.startswith(path_hash)]

    # return len(tracks)
    # print(db.get_all_tracks())
    return 1


def create_folder(_dir: Dir) -> Folder:
    """Create a single Folder object"""
    f_count = Store.get_folder_track_count(_dir.path)

    folder = {
        "name": _dir.path.split("/")[-1],
        "path": _dir.path,
        "is_sym": _dir.is_sym,
        "trackcount": f_count,
    }

    return Folder(**folder)


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
            if settings.USE_STORE:
                paths = [d.path for d in dirs]
                # FIXME: Pass is_sym to get_folder

                iterable = pool.map(Store.get_folder, paths)
                folders = [i for i in iterable if i is not None]
            else:
                iterable = pool.map(create_folder, dirs)
                folders = [i for i in iterable if i is not None]

        folders = filter(lambda f: f.trackcount > 0, folders)

        return (tracks, folders)
