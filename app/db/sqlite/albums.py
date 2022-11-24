import json

from typing import Generator
from collections import OrderedDict
from sqlite3 import Cursor

from app.db import AlbumMethods

from .utils import SQLiteManager, tuple_to_album, tuples_to_albums


class SQLiteAlbumMethods(AlbumMethods):
    @classmethod
    def insert_one_album(cls, album: dict, cur: Cursor):
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

        cur.execute(sql, params)

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
        with SQLiteManager() as cur:
            for album in albums:
                cls.insert_one_album(album, cur)

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

    @classmethod
    def get_albums_by_hashes(cls, album_hashes: list):
        """
        Gets all the albums with the specified hashes. Returns a generator of albums or an empty list.
        """
        with SQLiteManager() as cur:
            hashes = ",".join("?" * len(album_hashes))
            cur.execute(f"SELECT * FROM albums WHERE albumhash IN ({hashes})", album_hashes)
            albums = cur.fetchall()

            if albums is not None:
                return tuples_to_albums(albums)

        return []

    @staticmethod
    def update_album_colors(album_hash: str, colors: list[str]):
        sql = "UPDATE albums SET colors=? WHERE albumhash=?"

        colors_str = json.dumps(colors)

        with SQLiteManager() as cur:
            cur.execute(sql, (colors_str, album_hash))

    @staticmethod
    def get_albums_by_albumartist(albumartist: str):
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM albums WHERE albumartist=?", (albumartist,))
            albums = cur.fetchall()

            if albums is not None:
                return tuples_to_albums(albums)

        return []

    @staticmethod
    def get_all_albums_raw():
        """
        Returns all the albums in the database, as a list of tuples.
        """
        with SQLiteManager() as cur:
            cur.execute("SELECT * FROM albums")
            albums = cur.fetchall()

            if albums is not None:
                return albums

        return []
