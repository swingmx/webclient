"""
In memory store.
"""

from pathlib import Path

from tqdm import tqdm

from app.db.sqlite.tracks import SQLiteTrackMethods as tdb
from app.models import Folder, Track
from app.utils import UseBisection, create_hash

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
    def check_has_tracks(cls, path: str):
        path_hash = create_hash(path)
        tracks = [create_hash(f.path) for f in cls.folders]

        tracks_hash = "".join(tracks)
        return path_hash in tracks_hash

        # tracks.sort()

        # try:
        #     index = tracks.index(path_hash)
        # except ValueError:
        #     return 0

        # tracks = tracks[index + 1 :]

        # tracks = [path for path in tracks if path_hash in path]

    @classmethod
    def process_folders(cls):
        all_folders = [track.folder for track in cls.tracks]
        all_folders = set(all_folders)

        all_folders = [folder for folder in all_folders if folder not in cls.folders]

        all_folders = [Path(f) for f in all_folders]
        all_folders = [f for f in all_folders if f.exists()]

        for folder in tqdm(all_folders, desc="Processing folders"):
            path = Path(folder)

            folder = Folder(
                name=path.name,
                path=str(path),
                is_sym=path.is_symlink(),
                has_tracks=True,
                path_token_count=len(path.parts),
            )

            cls.folders.append(folder)

    @classmethod
    def get_folder(cls, path: str):  # type: ignore
        """
        Returns a folder object by its path.
        """
        folder = UseBisection(cls.folders, "path", [path])()[0]

        if folder is not None:
            return folder

        has_tracks = cls.check_has_tracks(path)

        if not has_tracks:
            return None

        path: Path = Path(path)  # type: ignore

        folder = Folder(
            name=path.name,
            path=str(path),
            is_sym=path.is_symlink(),
            has_tracks=True,
            path_token_count=len(path.parts),
        )
        cls.folders.append(folder)
        return folder

    @classmethod
    def update_store_folder_track_count(cls, path, count):
        folder = cls.get_folder(path)

        if folder is not None:
            cls.folders.remove(folder)
            folder.has_tracks = count
            cls.folders.append(folder)

    @classmethod
    def get_tracks_by_filepaths(cls, paths: list[str]) -> list[Track]:
        tracks = UseBisection(cls.tracks, "filepath", paths)()
        return [track for track in tracks if track is not None]
