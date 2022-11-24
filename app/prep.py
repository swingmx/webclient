"""
Contains the functions to prepare the server for use.
"""
import os
import shutil
from pathlib import Path
from sqlite3 import OperationalError

from app import settings
from app.db.sqlite import create_connection, create_tables
from app.settings import DB_PATH
from app.logger import log


from app.db.sqlite.search import SearchMethods


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

    dirs = [
        "",  # creates the config folder
        "images",
        os.path.join("images", "artists"),
        thumb_path,
        small_thumb_path,
        large_thumb_path,
        os.path.join("images", "playlists"),
    ]

    for _dir in dirs:
        path = os.path.join(config_folder, _dir)
        exists = os.path.exists(path)

        if not exists:
            os.makedirs(path)
            os.chmod(path, 0o755)

    CopyFiles()


def setup_sqlite():
    if not settings.USE_SQLITE:
        return

    # if os.path.exists(DB_PATH):
    #     os.remove(DB_PATH)

    try:
        conn = create_connection(DB_PATH)

        current_path = Path(__file__).parent.resolve()
        sql_path = "db/sqlite/queries/create_tables.sql"
        sql_path = current_path.joinpath(sql_path)

        create_tables(conn, str(sql_path))
        conn.close()
    except OperationalError:
        log.error("Failed to create database tables")

    SearchMethods.init_db()
    SearchMethods.load_existing_tracks()
    SearchMethods.load_existing_albums()


def run_checks():
    create_config_dir()
    setup_sqlite()
