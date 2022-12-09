"""
Contains the functions to prepare the server for use.
"""
import os
import shutil
from pathlib import Path
from sqlite3 import OperationalError

from app import settings
from app.db.sqlite import create_connection, create_tables
from app.db.store import Store
from app.logger import log
from app.settings import APP_DB_PATH, USERDATA_DB_PATH


class CopyFiles:
    """Copies assets to the app directory."""

    def __init__(self) -> None:
        files = [
            {
                "src": "assets",
                "dest": os.path.join(settings.APP_DIR, "assets"),
                "is_dir": True,
            }
        ]

        for entry in files:
            src = os.path.join(os.getcwd(), entry["src"])

            if entry["is_dir"]:
                shutil.copytree(
                    src,
                    entry["dest"],
                    ignore=shutil.ignore_patterns(
                        "*.pyc",
                    ),
                    copy_function=shutil.copy2,
                    dirs_exist_ok=True,
                )
                break

            shutil.copy2(src, entry["dest"])


def create_config_dir() -> None:
    """
    Creates the config directory if it doesn't exist.
    """

    home_dir = os.path.expanduser("~")
    config_folder = os.path.join(home_dir, settings.CONFIG_FOLDER)

    thumb_path = os.path.join("images", "thumbnails")
    small_thumb_path = os.path.join(thumb_path, "small")
    large_thumb_path = os.path.join(thumb_path, "large")

    artist_img_path = os.path.join("images", "artists")
    small_artist_img_path = os.path.join(artist_img_path, "small")
    large_artist_img_path = os.path.join(artist_img_path, "large")

    playlist_img_path = os.path.join("images", "playlists")

    dirs = [
        "",  # creates the config folder
        "images",
        thumb_path,
        small_thumb_path,
        large_thumb_path,
        artist_img_path,
        small_artist_img_path,
        large_artist_img_path,
        playlist_img_path,
    ]

    for _dir in dirs:
        path = os.path.join(config_folder, _dir)
        exists = os.path.exists(path)

        if not exists:
            os.makedirs(path)
            os.chmod(path, 0o755)

    CopyFiles()


def setup_sqlite():
    """
    Create Sqlite databases and tables.
    """
    # if os.path.exists(DB_PATH):
    #     os.remove(DB_PATH)

    try:
        app_db_conn = create_connection(APP_DB_PATH)
        playlist_db_conn = create_connection(USERDATA_DB_PATH)

        current_path = Path(__file__).parent.resolve()

        appdb_sql_path = "db/sqlite/queries/create_app_db_tables.sql"
        appdb_sql_path = current_path.joinpath(appdb_sql_path)

        playlist_db_sql_path = "db/sqlite/queries/create_userdata_db_tables.sql"
        playlist_db_sql_path = current_path.joinpath(playlist_db_sql_path)

        create_tables(app_db_conn, str(appdb_sql_path))
        create_tables(playlist_db_conn, str(playlist_db_sql_path))

        app_db_conn.close()
        playlist_db_conn.close()
    except OperationalError:
        log.error("Failed to create database tables")

    Store.load_all_tracks()
    Store.process_folders()
    Store.load_albums()
    Store.load_artists()


def run_checks():
    create_config_dir()
    setup_sqlite()
