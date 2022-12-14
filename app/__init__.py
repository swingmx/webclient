from flask import Flask
# from flask_caching import Cache
from flask_cors import CORS

from app import functions
from app.utils import background

from app.api import album, artist, favorites, folder, playlist, search, track

# config = {"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 300}

# cache = Cache(config=config)


def create_api():
    """
    Creates the Flask instance, registers modules and registers all the API blueprints.
    """
    app = Flask(__name__)
    CORS(app)

    # app.config.from_mapping(config)
    # cache.init_app(app)

    with app.app_context():

        app.register_blueprint(album.albumbp)
        app.register_blueprint(artist.artistbp)
        app.register_blueprint(track.trackbp)
        app.register_blueprint(search.searchbp)
        app.register_blueprint(folder.folderbp)
        app.register_blueprint(playlist.playlistbp)
        app.register_blueprint(favorites.favbp)

        return app


@background
def watch_files():
    """
    Starts the watchdog to watch for file changes.
    """
    functions.start_watchdog()
