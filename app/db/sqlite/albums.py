import json

from typing import Generator
from collections import OrderedDict
from sqlite3 import Connection, Error as SqlError

from app.db import AlbumMethods
from app.db.sqlite import get_sqlite_conn
from app.settings import DB_PATH

from .utils import SQLiteManager, tuple_to_album, tuples_to_albums


class SQLiteAlbumMethods(AlbumMethods):
    @classmethod
    def insert_one_album(
        cls, album: dict, conn: Connection = get_sqlite_conn(), and_commit=True
    ):
        """
        Takes a dictionary of album data, and inserts it into the database

        Parameters
        ----------
        album : dict
            dict
        conn : Connection
            Connection = get_sqlite_conn()
        and_commit, optional
            If True, the connection will be committed and closed. If False, the connection will be left open.

        Returns
        -------
            The last row id of the album that was inserted.

        """
        cur = conn.cursor()

        sql = """INSERT INTO albums(
            albumartist,
            albumhash,
            colors,
            copyright,
            date,
            title
            ) VALUES(?,?,?,?,?,?)
            """
        album = OrderedDict(sorted(album.items()))
        params = (*album.values(),)

        try:
            cur.execute(sql, params)
        except SqlError:
            return None

        if not and_commit:
            return cur.lastrowid

        conn.commit()
        conn.close()
        return cur.lastrowid

    @classmethod
    def insert_many_albums(cls, albums: Generator):
        """
        Takes a generator of albums, and inserts them into the database

        Parameters
        ----------
        albums : Generator
            Generator
        """
        conn = get_sqlite_conn()

        for album in albums:
            cls.insert_one_album(album, conn, and_commit=False)

        conn.commit()
        conn.close()

    @classmethod
    def get_all_albums(cls):
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM albums")
            albums = cur.fetchall()

            if albums is not None:
                return tuples_to_albums(albums)

            return None

    # @staticmethod
    # def get_album_by_id(album_id: int):
    #     conn = get_sqlite_conn()
    #     cur = conn.cursor()

    #     cur.execute("SELECT * FROM albums WHERE id=?", (album_id,))
    #     album = cur.fetchone()

    #     conn.close()

    #     if album is None:
    #         return None

    #     return tuple_to_album(album)

    @staticmethod
    def get_album_by_hash(album_hash: str):
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM albums WHERE albumhash=?", (album_hash,))
            album = cur.fetchone()

            if album is not None:
                return tuple_to_album(album)

            return None

    @staticmethod
    def update_album_colors(album_hash: str, colors: list[str]):
        sql = "UPDATE albums SET colors=? WHERE albumhash=?"

        colors_str = json.dumps(colors)

        with SQLiteManager() as cur:
            cur.execute(sql, (colors_str, album_hash))
