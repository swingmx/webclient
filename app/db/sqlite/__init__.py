import sqlite3
from sqlite3 import Connection as SqlConn, Error as SqlError

from app.settings import DB_PATH


def create_connection(db_file: str) -> SqlConn:
    conn = None

    try:
        conn = sqlite3.connect(db_file)
        return conn
    except SqlError as e:
        print(e)

    return conn


def get_sqlite_conn():
    """
    It opens a connection to the database
    :return: A connection to the database.
    """
    return create_connection(DB_PATH)


def create_tables(conn: SqlConn, sql_path: str):
    with open(sql_path, "r") as sql_file:
        conn.executescript(sql_file.read())

    # conn.close()
