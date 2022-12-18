from flask import Flask

from flask_cors import CORS

from app import functions
from app.utils import background

from app.api import album, artist, favorites, folder, playlist, search, track
from app.imgserver import app as imgserver


def create_api():
    """
    Creates the Flask instance, registers modules and registers all the API blueprints.
    """
    app = Flask(__name__, static_url_path="")
    CORS(app)

    with app.app_context():

        app.register_blueprint(album.albumbp)
        app.register_blueprint(artist.artistbp)
        app.register_blueprint(track.trackbp)
        app.register_blueprint(search.searchbp)
        app.register_blueprint(folder.folderbp)
        app.register_blueprint(playlist.playlistbp)
        app.register_blueprint(favorites.favbp)
        app.register_blueprint(imgserver)

        return app


@background
def watch_files():
    """
    Starts the watchdog to watch for file changes.
    """
    functions.start_watchdog()
