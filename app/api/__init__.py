"""
This module contains all the Flask Blueprints and API routes. It also contains all the globals list
that are used through-out the app. It handles the initialization of the watchdog,
checking and creating config dirs and starting the re-indexing process using a background thread.
"""
from app import functions
from app import utils
from app import prep
# from ..lib.folderslib import test_dir_images


@utils.background
def initialize() -> None:
    """
    Runs all the necessary setup functions.
    """
    # functions.start_watchdog()
    prep.create_config_dir()
    functions.run_checks()
    # test_dir_images()


initialize()
