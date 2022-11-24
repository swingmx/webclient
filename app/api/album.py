"""
Contains all the album routes.
"""

from flask import request
from flask import Blueprint

from app import utils

# from app import instances
# from app import models
# from app.functions import FetchAlbumBio

from app.db.sqlite.tracks import SQLiteTrackMethods
from app.db.sqlite.albums import SQLiteAlbumMethods
from app.db.sqlite.search import SearchMethods as search

get_tracks_by_albumhash = SQLiteTrackMethods.get_tracks_by_albumhash
get_album_by_id = SQLiteAlbumMethods.get_album_by_id
get_album_by_hash = SQLiteAlbumMethods.get_album_by_hash
get_albums_by_albumartist = SQLiteAlbumMethods.get_albums_by_albumartist

album_bp = Blueprint("album", __name__, url_prefix="")


@album_bp.route("/")
def say_hi():
    """Returns some text for the default route"""
    return "^ _ ^"


# @album_bp.route("/albums")
# def get_albums():
#     """returns all the albums"""
#     albums = []

#     for song in api.DB_TRACKS:
#         al_obj = {"name": song["album"], "artist": song["artists"]}

#         if al_obj not in albums:
#             albums.append(al_obj)

#     return {"albums": albums}


@album_bp.route("/album", methods=["POST"])
def get_album():
    """Returns all the tracks in the given album."""

    data = request.get_json()
    error_msg = {"msg": "No hash provided"}

    if data is None:
        return error_msg, 400

    try:
        albumhash = data["hash"]
    except KeyError:
        return error_msg, 400

    error_msg = {"error": "Album not created yet."}
    album = get_album_by_hash(albumhash)

    if album is None:
        return error_msg, 204

    tracks = get_tracks_by_albumhash(albumhash)
    if tracks is None:
        return error_msg, 404

    tracks = list(tracks)
    if len(tracks) == 0:
        return error_msg, 204

    tracks = utils.RemoveDuplicates(tracks)()
    album.count = len(tracks)

    try:
        album.duration = sum(t.duration for t in tracks)
    except AttributeError:
        album.duration = 0

    if (
        album.count == 1
        and tracks[0].title == album.title
        and tracks[0].track == 1
        and tracks[0].disc == 1
    ):
        album.is_single = True
    else:
        album.check_type()

    return {"tracks": tracks, "info": album}


@album_bp.route("/album/from-artist", methods=["POST"])
def get_artist_albums():
    data = request.get_json()

    if data is None:
        return {"msg": "No albumartist provided"}

    albumartists: str = data["albumartist"]
    limit: int = data.get("limit")
    exclude: str = data.get("exclude")

    albumartists = albumartists.split(",")  # type: ignore

    albums = [
        {
            "artist": a,
            "albums": list(search.find_artist_albums(a, limit, exclude=exclude)),
        }
        for a in albumartists
    ]

    albums = [a for a in albums if len(a["albums"]) > 0]

    return {"data": albums}


# @album_bp.route("/album/bio", methods=["POST"])
# def get_album_bio():
#     """Returns the album bio for the given album."""
#     data = request.get_json()
#     album_hash = data["hash"]
#     err_msg = {"bio": "No bio found"}

#     album = instances.album_instance.find_album_by_hash(album_hash)

#     if album is None:
#         return err_msg, 404

#     bio = FetchAlbumBio(album["title"], album["artist"])()

#     if bio is None:
#         return err_msg, 404

#     return {"bio": bio}


# @album_bp.route("/album/artists", methods=["POST"])
# def get_albumartists():
#     """
#     Returns a list of artists featured in a given album.
#     """

#     data = request.get_json()
#     albumhash = data["hash"]

#     tracks = instances.tracks_instance.find_tracks_by_albumhash(albumhash)
#     tracks = [models.Track(**t) for t in tracks]

#     artists = [a for t in tracks for a in t.artists]
#     artists = utils.get_normalized_artists(artists)

#     return {"artists": artists}
