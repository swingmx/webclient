"""
Search related functions for SQLite
"""

import sqlite3
from pathlib import Path

from app.db.sqlite.albums import SQLiteAlbumMethods
from app.db.sqlite.tracks import SQLiteTrackMethods
from app.db.sqlite.utils import SQLiteManager
from app.logger import log
from app.utils import create_hash

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
    def load_tracks(cls):
        """
        Loads all the tracks in the database into the in-memory database.
        """
        log.info("Loading tracks into search database")

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
            log.info("Loaded %s tracks", cur.rowcount)

    @classmethod
    def load_albums(cls):
        """
        Loads all the albums in the database into the in-memory database.
        """
        log.info("Loading albums into search db")

        albums = get_all_albums()

        def create_artist_hashes(artists: str):
            artists = artists.split(", ")  # type: ignore
            artists = [create_hash(artist) for artist in artists]  # type: ignore
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
            log.info("Loaded %s albums", (cur.rowcount))

    @classmethod
    def find_artist_albums(cls, artist: str, limit: int = 5, exclude: str = ""):
        """
        Returns all the albums by the specified album artist.
        """

        artist = create_hash(artist)
        artist = f"{artist}"

        sql = f"""SELECT * from albums WHERE albumartisthashes MATCH "{artist}" ORDER BY RANDOM() limit {limit}"""

        with SQLiteManager(cls.db) as cur:
            cur.execute(sql)
            albums = cur.fetchall()

            if albums is not None:
                albums = [album for album in albums if album[0] != exclude]

                if len(albums) == 0:
                    return []

                return get_albums_by_hashes([album[0] for album in albums])

        return []

    @classmethod
    def get_all_tracks(cls):
        """
        Returns all the tracks in the database.
        """

        sql = """SELECT * FROM tracks"""

        with SQLiteManager(cls.db) as cur:
            cur.execute(sql)
            tracks = cur.fetchall()

            if tracks is not None:
                return tracks

        return []
