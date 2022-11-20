"""
All playlist-related routes.
"""
import json
from datetime import datetime

from flask import Blueprint, request

from app import exceptions, instances, models, serializer
from app.db.sqlite.playlists import SQLitePlaylistMethods
from app.lib import playlistlib
from app.utils import Get, UseBisection, create_new_date

playlist_bp = Blueprint("playlist", __name__, url_prefix="/")

PlaylistExists = exceptions.PlaylistExistsError
TrackExistsInPlaylist = exceptions.TrackExistsInPlaylistError

insert_one_playlist = SQLitePlaylistMethods.insert_one_playlist
get_playlist_by_name = SQLitePlaylistMethods.get_playlist_by_name
count_playlist_by_name = SQLitePlaylistMethods.count_playlist_by_name


@playlist_bp.route("/playlists", methods=["GET"])
def get_all_playlists():
    """Returns all the playlists."""
    dbplaylists = instances.playlist_instance.get_all_playlists()
    dbplaylists = [models.Playlist(p) for p in dbplaylists]

    playlists = [
        serializer.Playlist(p, construct_last_updated=False) for p in dbplaylists
    ]
    playlists.sort(
        key=lambda p: datetime.strptime(p.last_updated, "%Y-%m-%d %H:%M:%S"),
        reverse=True,
    )
    return {"data": playlists}


@playlist_bp.route("/playlist/new", methods=["POST"])
def create_playlist():
    """
    Creates a new playlist. Accepts POST method with a JSON body.
    """
    data = request.get_json()

    if data is None:
        return {"error": "Playlist name not provided"}, 400

    existing_playlist_count = count_playlist_by_name(data["name"])

    if existing_playlist_count > 0:
        return {"error": "Playlist already exists"}, 409

    playlist = {
        "artistids": json.dumps([]),
        "image": None,
        "last_updated": create_new_date(),
        "name": data["name"],
        "trackids": json.dumps([]),
    }

    playlist = insert_one_playlist(playlist)

    if playlist is None:
        return {"error": "Playlist could not be created"}, 500

    return {"playlist": playlist}, 201


@playlist_bp.route("/playlist/<playlist_id>/add", methods=["POST"])
def add_track_to_playlist(playlist_id: str):
    data = request.get_json()

    trackid = data["track"]

    try:
        playlistlib.add_track(playlist_id, trackid)
    except TrackExistsInPlaylist:
        return {"error": "Track already exists in playlist"}, 409

    return {"msg": "I think It's done"}, 200


@playlist_bp.route("/playlist/<playlistid>")
def get_playlist(playlistid: str):
    p = instances.playlist_instance.get_playlist_by_id(playlistid)
    if p is None:
        return {"info": {}, "tracks": []}

    playlist = models.Playlist(p)

    tracks = playlistlib.create_playlist_tracks(playlist.pretracks)

    duration = sum([t.duration for t in tracks])
    playlist = serializer.Playlist(playlist)
    playlist.duration = duration

    return {"info": playlist, "tracks": tracks}


@playlist_bp.route("/playlist/<playlistid>/update", methods=["PUT"])
def update_playlist(playlistid: str):
    image = None

    if "image" in request.files:
        image = request.files["image"]

    data = request.form

    playlist = {
        "name": str(data.get("name")).strip(),
        "last_updated": create_new_date(),
        "image": None,
        "thumb": None,
    }

    playlists = Get.get_all_playlists()

    p = UseBisection(playlists, "playlistid", [playlistid])()
    p: models.Playlist = p[0]

    if playlist is not None:
        if image:
            playlist["image"], playlist["thumb"] = playlistlib.save_p_image(
                image, playlistid
            )
        elif p.image:
            [playlist["image"], playlist["thumb"]] = [p.image, p.thumb]

        p.update_playlist(playlist)
        instances.playlist_instance.update_playlist(playlistid, playlist)

        return {
            "data": serializer.Playlist(p),
        }

    return {"msg": "Something shady happened"}, 500


@playlist_bp.route("/playlist/artists", methods=["POST"])
def get_playlist_artists():
    data = request.get_json()

    pid = data["pid"]
    artists = playlistlib.GetPlaylistArtists(pid)()

    return {"data": artists}
