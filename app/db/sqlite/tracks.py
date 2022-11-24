"""
Contains the SQLiteTrackMethods class which contains methods for
interacting with the tracks table.
"""


from sqlite3 import Cursor

from app.db.sqlite.utils import tuple_to_track, tuples_to_tracks

from .utils import SQLiteManager


class SQLiteTrackMethods:
    """
    This class contains all methods for interacting with the tracks table.
    """

    @classmethod
    def insert_one_track(cls, track: dict, cur: Cursor):
        """
        Inserts a single track into the database.
        """
        sql = """INSERT INTO tracks(
            album,
            albumartist,
            albumhash,
            artist,
            bitrate,
            copyright,
            date,
            disc,
            duration,
            filepath,
            folder,
            genre,
            title,
            track,
            trackhash
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """

        cur.execute(
            sql,
            (
                track["album"],
                track["albumartist"],
                track["albumhash"],
                track["artist"],
                track["bitrate"],
                track["copyright"],
                track["date"],
                track["disc"],
                track["duration"],
                track["filepath"],
                track["folder"],
                track["genre"],
                track["title"],
                track["track"],
                track["trackhash"],
            ),
        )

    @classmethod
    def insert_many_tracks(cls, tracks: list[dict]):
        """
        Inserts a list of tracks into the database.
        """
        with SQLiteManager() as cur:
            for track in tracks:
                cls.insert_one_track(track, cur)

    @staticmethod
    def get_all_tracks():
        """
        Get all tracks from the database and return a generator of Track objects
        or an empty list.
        """
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM tracks")
            rows = cur.fetchall()

            if rows is not None:
                return tuples_to_tracks(rows)

            return []

    @staticmethod
    def find_track_by_filepath(filepath: str):
        """
        Find a track by its filepath. Returns a Track object or None.
        """
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM tracks WHERE filepath=?", (filepath,))
            row = cur.fetchone()

            if row is not None:
                return tuple_to_track(row)

            return None

    @staticmethod
    def find_tracks_by_filepath(filenames: list[str]):
        """
        Find all tracks in the database whose filepath is in the list
        of filepaths. Returns a generator of Track objects or an empty list.
        """
        with SQLiteManager() as cur:
            sql = "SELECT * FROM tracks WHERE filepath IN ({})".format(
                ",".join("?" * len(filenames))
            )
            cur.execute(sql, filenames)
            rows = cur.fetchall()

            if rows is not None:
                return tuples_to_tracks(rows)

            return []

    @staticmethod
    def get_folder_count(folder: str):
        """
        Get the number of tracks in a folder.
        """
        with SQLiteManager() as cur:
            cur.execute("SELECT COUNT(*) FROM tracks WHERE folder=?", (folder,))
            count = cur.fetchone()[0]

            return int(count)

    @staticmethod
    def get_track_by_id(rowid: int):
        """
        Get a track by its rowid. Returns a Track object or None.
        """
        with SQLiteManager() as cur:

            cur.execute("SELECT * FROM tracks WHERE id=?", (rowid,))
            row = cur.fetchone()

            if row is not None:
                return tuple_to_track(row)

            return None

    @staticmethod
    def get_track_by_trackhash(trackhash: str):
        """
        Gets a track using its trackhash. Returns a Track object or None.
        """
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM tracks WHERE trackhash=?", (trackhash,))
            row = cur.fetchone()

            if row is not None:
                return tuple_to_track(row)

            return None

    @staticmethod
    def get_tracks_by_albumhash(albumhash: str):
        """
        Gets all tracks in an album using its albumhash.
        Returns a generator of Track objects or an empty list.
        """

        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM tracks WHERE albumhash=?", (albumhash,))
            rows = cur.fetchall()

            if rows is not None:
                return tuples_to_tracks(rows)

            return []

    @staticmethod
    def get_tracks_by_trackhashes(hashes: list[str]):
        """
        Gets all tracks in a list of trackhashes.
        Returns a generator of Track objects or an empty list.
        """

        sql = "SELECT * FROM tracks WHERE trackhash IN ({})".format(
            ",".join("?" * len(hashes))
        )

        with SQLiteManager() as cur:
            cur.execute(sql, hashes)
            rows = cur.fetchall()

            if rows is not None:
                return tuples_to_tracks(rows)

            return []

    @staticmethod
    def get_all_tracks_raw() -> list[tuple]:
        """
        Get all tracks from the database. Returns a list of tuples
        or an empty list.
        """
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM tracks")
            rows = cur.fetchall()

            if rows is not None:
                return rows

            return []
