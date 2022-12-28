from flask import Blueprint, request
from app.db.sqlite.favorite import SQLiteFavoriteMethods as favdb
from app.db.store import Store
from app.models import FavType

favbp = Blueprint("favorite", __name__, url_prefix="/")


@favbp.route("/favorite", methods=["POST"])
def add_favorite():
    """
    Adds a favorite to the database.
    """
    data = request.get_json()

    if data is None:
        return {"error": "No data provided"}, 400

    itemhash = data.get("hash")
    itemtype = data.get("type")

    favdb.insert_one_favorite(itemtype, itemhash)

    if itemtype == FavType.track:
        Store.add_fav_track(itemhash)

    return {"msg": "Added to favorites"}


@favbp.route("/favorite/remove", methods=["POST"])
def remove_favorite():
    """
    Removes a favorite from the database.
    """
    data = request.get_json()

    if data is None:
        return {"error": "No data provided"}, 400

    itemhash = data.get("hash")
    itemtype = data.get("type")

    favdb.delete_favorite(itemtype, itemhash)

    if itemtype == FavType.track:
        Store.remove_fav_track(itemhash)

    return {"msg": "Removed from favorites"}


@favbp.route("/albums/favorite")
def get_favorite_albums():
    limit = request.args.get("limit")

    if limit is None:
        limit = 6

    limit = int(limit)

    albums = favdb.get_fav_albums()
    albumhashes = "-".join(a[1] for a in albums)

    albums = [a for a in Store.albums if a.albumhash in albumhashes]

    if limit == 0:
        limit = len(albums)

    return {"albums": albums[:limit]}


@favbp.route("/tracks/favorite")
def get_favorite_tracks():
    limit = request.args.get("limit")

    if limit is None:
        limit = 6

    limit = int(limit)

    tracks = favdb.get_fav_tracks()
    trackhashes = "-".join(t[1] for t in tracks)

    tracks = [t for t in Store.tracks if t.trackhash in trackhashes]

    if limit == 0:
        limit = len(tracks)

    return {"tracks": tracks[:limit]}


@favbp.route("/artists/favorite")
def get_favorite_artists():
    limit = request.args.get("limit")

    if limit is None:
        limit = 6

    limit = int(limit)

    artists = favdb.get_fav_artists()
    artisthashes = "-".join(t[1] for t in artists)

    artists = [t for t in Store.artists if t.artisthash in artisthashes]

    if limit == 0:
        limit = len(artists)

    return {"artists": artists[:limit]}
