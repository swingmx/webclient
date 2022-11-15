from pprint import pprint
from sqlite3 import Cursor

from app.db.sqlite import get_sqlite_conn


def insert_one_album(cur: Cursor, album: dict):
    sql = """INSERT INTO albums(
        title,
        albumartist,
        albumhash,
        albumartistid,
        date,
        copyright,
        colors
        ) VALUES(?,?,?,?,?,?,?)
        """

    cur.execute(
        sql,
        (
            album["title"],
            album["albumartist"],
            album["albumhash"],
            1,
            album["date"],
            album["copyright"],
            album["colors"],
        ),
    )


def save_albums(albums: list):
    conn = get_sqlite_conn()
    cur = conn.cursor()
    pprint(albums[0])

    for album in albums:
        insert_one_album(cur, album)

    conn.commit()
    conn.close()
