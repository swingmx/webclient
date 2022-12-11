"""
This module contains functions for the server
"""
import time

from requests import ConnectionError as RequestConnectionError, ReadTimeout

from app import utils
from app.lib import watchdoge
from app.lib.artistlib import CheckArtistImages
from app.lib.colorlib import ProcessAlbumColors, ProcessArtistColors
from app.lib.populate import Populate, ProcessTrackThumbnails
from app.logger import get_logger

log = get_logger()


@utils.background
def run_secondary_checks():
    """
    Checks for new songs every 5 minutes.
    """
    # ValidateAlbumThumbs()
    # ValidatePlaylistThumbs()

    while True:
        # trackslib.validate_tracks()

        Populate()
        # CreateAlbums()
        ProcessTrackThumbnails()
        ProcessAlbumColors()
        ProcessArtistColors()

        if utils.Ping()():
            try:
                CheckArtistImages()
            except (RequestConnectionError, ReadTimeout):
                log.error(
                    "Internet connection lost. Downloading artist images stopped."
                )

        time.sleep(300)


@utils.background
def start_watchdog():
    """
    Starts the file watcher.
    """
    watchdoge.watch.run()
