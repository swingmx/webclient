"""
All playlist-related routes.
"""
import json
from datetime import datetime

from flask import Blueprint, request

from app import models, serializer

from app.lib import playlistlib
from app.utils import create_new_date

from app.db.sqlite.tracks import SQLiteTrackMethods
from app.db.sqlite.playlists import SQLitePlaylistMethods

playlist_bp = Blueprint("playlist", __name__, url_prefix="/")

PL = SQLitePlaylistMethods

insert_one_playlist = PL.insert_one_playlist
get_playlist_by_name = PL.get_playlist_by_name
count_playlist_by_name = PL.count_playlist_by_name
get_all_playlists = PL.get_all_playlists
get_playlist_by_id = PL.get_playlist_by_id
tracks_to_playlist = PL.add_tracks_to_playlist
add_artist_to_playlist = PL.add_artist_to_playlist
update_playlist = PL.update_playlist

get_tracks_by_trackhashes = SQLiteTrackMethods.get_tracks_by_trackhashes


@playlist_bp.route("/playlists", methods=["GET"])
def send_all_playlists():
    """
    Gets all the playlists.
    """
    playlists = get_all_playlists()
    playlists = list(playlists)

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
        "artisthashes": json.dumps([]),
        "image": None,
        "last_updated": create_new_date(),
        "name": data["name"],
        "trackhashes": json.dumps([]),
    }

    playlist = insert_one_playlist(playlist)

    if playlist is None:
        return {"error": "Playlist could not be created"}, 500

    return {"playlist": playlist}, 201


@playlist_bp.route("/playlist/<playlist_id>/add", methods=["POST"])
def add_track_to_playlist(playlist_id: str):
    """
    Takes a playlist ID and a track hash, and adds the track to the playlist
    """
    data = request.get_json()

    if data is None:
        return {"error": "Track hash not provided"}, 400

    trackhash = data["track"]

    insert_count = tracks_to_playlist(int(playlist_id), [trackhash])

    if insert_count == 0:
        return {"error": "Track already exists in playlist"}, 409

    add_artist_to_playlist(int(playlist_id), trackhash)

    return {"msg": "Done"}, 200


@playlist_bp.route("/playlist/<playlistid>")
def get_playlist(playlistid: str):
    """
    Gets a playlist by id, and if it exists, it gets all the tracks in the playlist and returns them.
    """
    playlist = get_playlist_by_id(int(playlistid))

    if playlist is None:
        return {"msg": "Playlist not found"}, 404

    tracks = get_tracks_by_trackhashes(list(playlist.trackhashes))
    tracks = list(tracks)

    duration = sum(t.duration for t in tracks)
    playlist.last_updated = serializer.date_string_to_time_passed(playlist.last_updated)

    playlist.duration = duration

    return {"info": playlist, "tracks": tracks}


@playlist_bp.route("/playlist/<playlistid>/update", methods=["PUT"])
def update_playlist_info(playlistid: str):
    if playlistid is None:
        return {"error": "Playlist ID not provided"}, 400

    db_playlist = get_playlist_by_id(int(playlistid))

    if db_playlist is None:
        return {"error": "Playlist not found"}, 404

    image = None

    if "image" in request.files:
        image = request.files["image"]

    data = request.form

    playlist = {
        "id": int(playlistid),
        "artisthashes": json.dumps([]),
        "image": db_playlist.image,
        "last_updated": create_new_date(),
        "name": str(data.get("name")).strip(),
        "trackhashes": json.dumps([]),
    }

    if image:
        playlist["image"] = playlistlib.save_p_image(image, playlistid)

    p_tuple = (*playlist.values(),)

    update_playlist(int(playlistid), playlist)

    playlist = models.Playlist(*p_tuple)
    playlist.last_updated = serializer.date_string_to_time_passed(playlist.last_updated)

    return {
        "data": playlist,
    }


# @playlist_bp.route("/playlist/artists", methods=["POST"])
# def get_playlist_artists():
#     data = request.get_json()

#     pid = data["pid"]
#     artists = playlistlib.GetPlaylistArtists(pid)()

#     return {"data": artists}
