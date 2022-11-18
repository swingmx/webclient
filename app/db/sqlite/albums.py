from pprint import pprint
from sqlite3 import Cursor
from typing import Generator
from collections import OrderedDict

from app.db.sqlite import get_sqlite_conn


def insert_one_album(cur: Cursor, album: dict):
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
    cur.execute(sql, params)


def save_albums(albums: Generator):
    conn = get_sqlite_conn()
    cur = conn.cursor()

    pprint(next(albums))

    for album in albums:
        insert_one_album(cur, album)

    conn.commit()
    conn.close()
