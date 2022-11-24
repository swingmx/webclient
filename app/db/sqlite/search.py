"""
Search related functions for SQLite
"""

import sqlite3
from pathlib import Path

from app.utils import create_safe_name
from .tracks import SQLiteTrackMethods
from .albums import SQLiteAlbumMethods
from .utils import SQLiteManager

get_all_tracks = SQLiteTrackMethods.get_all_tracks_raw
get_all_albums = SQLiteAlbumMethods.get_all_albums_raw
get_albums_by_hashes = SQLiteAlbumMethods.get_albums_by_hashes


class SearchMethods:
    """
    Contains methods for searching the database in-memory database.
    """

    db = None

    @classmethod
    def init_db(cls):
        """
        Creates an in-memory SQLite db for searching purposes. Executes a SQL
        file to create the required tables.
        """

        cls.db = sqlite3.connect(":memory:", check_same_thread=False)
        sql_file = "queries/fts5.sql"

        current_path = Path(__file__).parent.resolve()
        sql_path = current_path.joinpath(sql_file)

        with open(sql_path, "r", encoding="utf-8") as sql_file:
            cls.db.executescript(sql_file.read())

    # @classmethod
    # def get_cursor(cls) -> Cursor:  # type: ignore
    #     """
    #     Returns a cursor to the in-memory database.
    #     """
    #     if cls.db is not None:
    #         return cls.db.cursor()

    @classmethod
    def load_existing_tracks(cls):
        """
        Loads all the tracks in the database into the in-memory database.
        """

        tracks = get_all_tracks()

        tracks = [
            (
                track[1],
                track[2],
                track[5],
                track[13],
                track[15],
            )
            for track in tracks
        ]
        # 👆 extracts the album, albumartist, artists, title and trackhash
        # properties from the tracks in that order.

        sql = """INSERT INTO tracks (
            album,
            albumartist,
            artists,
            title,
            trackhash
        ) VALUES (?, ?, ?, ?, ?)"""

        with SQLiteManager(cls.db) as cur:
            cur.executemany(sql, tracks)
            print("Loaded tracks into search db")
            print(f"Total tracks: {cur.rowcount}")

    @classmethod
    def load_existing_albums(cls):
        """
        Loads all the albums in the database into the in-memory database.
        """
        albums = get_all_albums()

        def create_artist_hashes(artists: str):
            artists = artists.split(", ")  # type: ignore
            artists = [create_safe_name(artist) for artist in artists]  # type: ignore
            artists = "-".join(artists)

            return "-" + artists + "-"

        albums = [
            [album[2], album[1], create_artist_hashes(album[1]), album[6]]
            for album in albums
        ]

        sql = """INSERT INTO albums (
            albumhash,
            albumartist,
            albumartisthashes,
            title
        ) VALUES (?, ?, ?, ?)"""

        with SQLiteManager(cls.db) as cur:
            cur.executemany(sql, albums)
            print("Loaded albums into search db")
            print(f"Total albums: {cur.rowcount}")

    @classmethod
    def find_artist_albums(cls, artist: str, limit: int = 5, exclude: str = ""):
        """
        Returns all the albums by the specified album artist.
        """

        artist = create_safe_name(artist)
        artist = f"{artist}"

        sql = f"""SELECT * from albums WHERE albumartisthashes MATCH "{artist}" limit {limit}"""

        with SQLiteManager(cls.db) as cur:
            cur.execute(sql)
            albums = cur.fetchall()

            if albums is not None:
                albums = [album for album in albums if album[0] != exclude]

                if len(albums) == 0:
                    return []

                return get_albums_by_hashes([album[0] for album in albums])

        return []

    # @classmethod
    # def get_all_abums(cls):
    #     """
    #     Returns all the albums in the database.
    #     """
    #     sql = """SELECT * FROM albums"""

    #     with SQLiteManager(cls.db) as cur:
    #         cur.execute(sql)
    #         # pprint(cur.fetchall())
