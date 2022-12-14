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
