from sqlite3 import Connection

from app.db import TrackMethods
from app.db.sqlite import get_sqlite_conn
from app.db.sqlite.utils import tuple_to_track, tuples_to_tracks


class SQLiteTrackMethods(TrackMethods):
    @classmethod
    def insert_one_track(
        cls, track: dict, conn: Connection = get_sqlite_conn(), commit=True
    ):
        cur = conn.cursor()

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

        if not commit:
            return

        conn.commit()
        conn.close()

    @classmethod
    def insert_many_tracks(cls, tracks: list):
        conn = get_sqlite_conn()

        for track in tracks:
            cls.insert_one_track(track, conn, commit=False)

        conn.commit()
        conn.close()

    @staticmethod
    def get_all_tracks():
        conn = get_sqlite_conn()
        cur = conn.cursor()

        cur.execute("SELECT * FROM tracks")
        rows = cur.fetchall()
        conn.close()

        return tuples_to_tracks(rows)

    @staticmethod
    def find_track_by_filepath(filepath: str):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        cur.execute("SELECT * FROM tracks WHERE filepath=?", (filepath,))
        row = cur.fetchone()
        conn.close()

        return tuples_to_tracks(row)

    @staticmethod
    def find_tracks_by_filepath(filenames: list[str]):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        sql = "SELECT * FROM tracks WHERE filepath IN ({})".format(
            ",".join("?" * len(filenames))
        )
        cur.execute(sql, filenames)
        rows = cur.fetchall()
        conn.close()

        return tuples_to_tracks(rows)

    @staticmethod
    def get_folder_count(folder: str):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) FROM tracks WHERE folder=?", (folder,))
        count = cur.fetchone()[0]
        conn.close()

        return count

    @staticmethod
    def get_track_by_id(id: int):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        cur.execute("SELECT * FROM tracks WHERE id=?", (id,))
        row = cur.fetchone()
        conn.close()

        if row is None:
            return None

        return tuple_to_track(row)

    @staticmethod
    def get_track_by_trackhash(trackhash: str):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        cur.execute("SELECT * FROM tracks WHERE trackhash=?", (trackhash,))
        row = cur.fetchone()
        conn.close()

        if row is None:
            return None

        return tuple_to_track(row)

    @staticmethod
    def get_tracks_by_albumhash(albumhash: str):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        cur.execute("SELECT * FROM tracks WHERE albumhash=?", (albumhash,))
        rows = cur.fetchall()
        conn.close()

        if rows is None:
            return None

        return tuples_to_tracks(rows)

    @staticmethod
    def get_tracks_by_trackhashes(hashes: list[str]):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        sql = "SELECT * FROM tracks WHERE trackhash IN ({})".format(
            ",".join("?" * len(hashes))
        )

        cur.execute(sql, hashes)
        rows = cur.fetchall()
        conn.close()

        if rows is not None:
            return tuples_to_tracks(rows)

        return []
