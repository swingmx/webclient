"""
In memory store.
"""

from tqdm import tqdm
from pathlib import Path

from app.utils import create_hash
from app.utils import UseBisection
from app.models import Track, Folder
from app.db.sqlite.tracks import SQLiteTrackMethods as tdb


class Store:
    """
    This class holds all tracks in memory and provides methods for
    interacting with them.
    """

    tracks: list[Track] = []
    folders: list[Folder] = []

    @classmethod
    def load_all_tracks(cls):
        """
        Loads all tracks from the database into the store.
        """

        cls.tracks = list(tdb.get_all_tracks())

    @classmethod
    def get_folder_track_count(cls, path: str):
        path_hash = create_hash(path)
        tracks = [create_hash(track.folder) for track in cls.tracks]

        tracks.sort()

        try:
            index = tracks.index(path_hash)
        except ValueError:
            return 0

        tracks = tracks[index + 1 :]

        tracks = [path for path in tracks if path_hash in path]

        return len(tracks)

    @classmethod
    def process_folders(cls):
        all_folders = [track.folder for track in cls.tracks]
        all_folders = set(all_folders)

        all_folders = [Path(f) for f in all_folders]
        all_folders = [f for f in all_folders if f.exists()]

        for folder in tqdm(all_folders, desc="Processing folders"):
            path = Path(folder)

            folder = Folder(
                name=path.name,
                path=str(path),
                is_sym=path.is_symlink(),
                trackcount=cls.get_folder_track_count(str(folder)),
                path_token_count=len(path.parts),
            )

            cls.folders.append(folder)

    @classmethod
    def get_folders_by_subpath(cls, path: str):
        """
        Returns all folders that contain the given substring.
        """
        path = path.lower()

        folders = [f for f in cls.folders if path in f.path.lower()]

        return folders

    @classmethod
    def get_folder(cls, path: str):  # type: ignore
        """
        Returns a folder object by its path.
        """
        folder = UseBisection(cls.folders, "path", [path])()[0]

        if folder is not None:
            return folder

        folders = cls.get_folders_by_subpath(path)

        if len(folders) == 0:
            return None

        folders.sort(key=lambda f: f.path_token_count)

        folders = [
            f for f in folders if f.path_token_count == folders[0].path_token_count
        ]

        this_path_count = sum(f.trackcount for f in folders)
        path: Path = Path(path)  # type: ignore

        return Folder(
            name=path.name,
            path=str(path),
            is_sym=path.is_symlink(),
            trackcount=this_path_count,
            path_token_count=len(path.parts),
        )
