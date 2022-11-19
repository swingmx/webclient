import sqlite3
from app.models import Album, Track


def tuples_to_tracks(tracks: list[tuple]):
    for track in tracks:
        yield Track(*track)


def tuples_to_albums(albums: list[tuple]):
    for album in albums:
        yield Album(*album)


class SQLiteManager:
    def __init__(self, db_path: str) -> None:
        self.db_path = db_path

    def __enter__(self):
        self.conn = sqlite3.connect(self.db_path)
        self.cur = self.conn.cursor()
        return self.cur

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.conn.commit()
        self.conn.close()
