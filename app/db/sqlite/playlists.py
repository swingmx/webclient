from collections import OrderedDict
from sqlite3 import Error as SqlError

from app.db.sqlite.utils import SQLiteManager, tuple_to_playlist, tuples_to_playlists


class SQLitePlaylistMethods:
    """
    This class contains methods for interacting with the playlists table.
    """

    @staticmethod
    def insert_one_playlist(playlist: dict):
        sql = """INSERT INTO playlists(
            artistids,
            image,
            last_updated,
            name,
            trackids
            ) VALUES(?,?,?,?,?)
            """

        playlist = OrderedDict(sorted(playlist.items()))
        params = (*playlist.values(),)

        with SQLiteManager() as cur:
            cur.execute(sql, params)
            pid = cur.lastrowid
            params = (pid, *params)

            return tuple_to_playlist(params)

    @staticmethod
    def get_playlist_by_name(name: str):
        sql = "SELECT * FROM playlists WHERE name = ?"

        with SQLiteManager() as cur:
            cur.execute(sql, (name,))

            data = cur.fetchone()

            if data is not None:
                return tuple_to_playlist(data)

            return None

    @staticmethod
    def count_playlist_by_name(name: str):
        sql = "SELECT COUNT(*) FROM playlists WHERE name = ?"

        with SQLiteManager() as cur:
            cur.execute(sql, (name,))

            data = cur.fetchone()

            return int(data[0])

    @staticmethod
    def get_all_playlists():
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM playlists")
            playlists = cur.fetchall()

            if playlists is not None:
                return tuples_to_playlists(playlists)

            return None
