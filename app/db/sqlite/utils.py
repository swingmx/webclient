"""
Helper functions for use with the SQLite database.
"""

import sqlite3

from sqlite3 import Connection, Cursor
from app.models import Album, Playlist, Track
from app.settings import DB_PATH


def tuple_to_track(track: tuple):
    """
    Takes a tuple and returns a Track object
    """
    return Track(*track)


def tuples_to_tracks(tracks: list[tuple]):
    """
    Takes a list of tuples and returns a generator that yields a Track object for each tuple
    """
    for track in tracks:
        yield tuple_to_track(track)


def tuple_to_album(album: tuple):
    """
    Takes a tuple and returns an Album object
    """
    return Album(*album)


def tuples_to_albums(albums: list[tuple]):
    """
    Takes a list of tuples and returns a generator that yields an album object for each tuple
    """
    for album in albums:
        yield tuple_to_album(album)


def tuple_to_playlist(playlist: tuple):
    """
    Takes a tuple and returns a Playlist object
    """
    return Playlist(*playlist)


def tuples_to_playlists(playlists: list[tuple]):
    """
    Takes a list of tuples and returns a list of Playlist objects
    """
    for playlist in playlists:
        yield tuple_to_playlist(playlist)


class SQLiteManager:
    """
    This is a context manager that handles the connection and cursor
    for you. It also commits and closes the connection when you're done.
    """

    def __init__(self) -> None:
        self.conn: Connection
        self.cur: Cursor
        self.db_path = DB_PATH

    def __enter__(self):
        self.conn = sqlite3.connect(self.db_path)
        self.cur = self.conn.cursor()
        return self.cur

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.conn.commit()
        self.conn.close()
