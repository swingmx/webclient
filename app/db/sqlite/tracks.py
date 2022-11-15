from pprint import pprint
from sqlite3 import Cursor

from app.db.sqlite import get_sqlite_conn


def insert_one_track(cur: Cursor, track: dict):
    sql = """INSERT INTO tracks(
        album,
        albumartist,
        albumhash,
        albumid,
        artist,
        bitrate,
        copyright,
        date,
        disc,
        duration,
        filepath,
        folder,
        genre,
        title,
        track,
        trackhash
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """

    cur.execute(
        sql,
        (
            track["album"],
            track["albumartist"],
            track["albumhash"],
            1,
            track["artist"],
            track["bitrate"],
            track["copyright"],
            track["date"],
            track["disc"],
            track["duration"],
            track["filepath"],
            track["folder"],
            track["genre"],
            track["title"],
            track["track"],
            track["trackhash"],
        ),
    )
    pass


def save_tracks(tracks: list):
    conn = get_sqlite_conn()
    cur = conn.cursor()

    for track in tracks:
        insert_one_track(cur, track)

    conn.commit()
    conn.close()


def fetch_all_tracks():
    conn = get_sqlite_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM tracks")
    rows = cur.fetchall()

    pprint(rows)

    conn.close()

    return rows
