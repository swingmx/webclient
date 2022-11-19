from sqlite3 import Connection, Error as SqlError
from typing import Generator
from collections import OrderedDict
from app.db import AlbumMethods
from app.db.sqlite import get_sqlite_conn

from .utils import tuples_to_albums


class SQLiteAlbumMethods(AlbumMethods):
    @classmethod
    def insert_one_album(
        cls, album: dict, conn: Connection = get_sqlite_conn(), commit=True
    ):
        cur = conn.cursor()

        sql = """INSERT INTO albums(
            albumartist,
            albumartistid,
            albumhash,
            colors,
            copyright,
            date,
            title
            ) VALUES(?,?,?,?,?,?,?)
            """
        album = OrderedDict(sorted(album.items()))
        params = (*album.values(),)

        try:
            cur.execute(sql, params)
        except SqlError:
            return None

        if not commit:
            return cur.lastrowid

        conn.commit()
        conn.close()
        return cur.lastrowid

    @classmethod
    def insert_many_albums(cls, albums: Generator):
        conn = get_sqlite_conn()

        for album in albums:
            cls.insert_one_album(album, conn, commit=False)

        conn.commit()
        conn.close()

    @classmethod
    def get_all_albums(cls):
        conn = get_sqlite_conn()
        cur = conn.cursor()

        cur.execute("SELECT * FROM albums")
        albums = cur.fetchall()

        conn.close()

        return tuples_to_albums(albums)
