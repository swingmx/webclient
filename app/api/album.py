"""
Contains all the album routes.
"""

from flask import Blueprint, request

from app import utils
from app.db.sqlite.albums import SQLiteAlbumMethods
from app.db.sqlite.tracks import SQLiteTrackMethods
from app.db.store import Store

from app.models import Track

get_tracks_by_albumhash = SQLiteTrackMethods.get_tracks_by_albumhash
get_album_by_id = SQLiteAlbumMethods.get_album_by_id
get_albums_by_albumartist = SQLiteAlbumMethods.get_albums_by_albumartist

album_bp = Blueprint("album", __name__, url_prefix="")


@album_bp.route("/")
def say_hi():
    """Returns some text for the default route"""
    return "^ _ ^"


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
    album = Store.get_album_by_hash(albumhash)

    if album is None:
        return error_msg, 204

    tracks = Store.get_tracks_by_albumhash(albumhash)
    if tracks is None:
        return error_msg, 404

    tracks = list(tracks)
    if len(tracks) == 0:
        return error_msg, 204

    def get_album_genres(tracks: list[Track]):
        genres = set()

        for track in tracks:
            if track.genre is not None:
                genres.update(track.genre)

        return list(genres)

    album.genres = get_album_genres(tracks)
    tracks = utils.remove_duplicates(tracks)
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

    albumartists: str = data["albumartists"]  # type: ignore
    limit: int = data.get("limit")
    exclude: str = data.get("exclude")

    albumartists: list[str] = albumartists.split(",")  # type: ignore

    albums = [
        {
            "artisthash": a,
            "albums": Store.get_albums_by_albumartist(a, limit, exclude=exclude),
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
