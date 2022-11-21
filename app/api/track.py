"""
Contains all the track routes.
"""
from flask import Blueprint
from flask import send_file


from app import instances
from app.db.sqlite.tracks import SQLiteTrackMethods

track_bp = Blueprint("track", __name__, url_prefix="/")

get_track_by_id = SQLiteTrackMethods.get_track_by_id
get_track_by_hash = SQLiteTrackMethods.get_track_by_trackhash


@track_bp.route("/file/<id_and_hash>")
def send_track_file(id_and_hash: str):
    """
    Returns an audio file that matches the passed id to the client.
    Falls back to track hash if id is not found.
    """
    [trackid, track_hash] = id_and_hash.split("-")
    track = get_track_by_id(int(trackid))

    if (track is None) or (track.trackhash != track_hash):
        track = get_track_by_hash(track_hash)

    msg = {"msg": "File Not Found"}

    if track is None:
        return msg, 404

    audio_type = track.filepath.rsplit(".", maxsplit=1)[-1]

    try:
        return send_file(track.filepath, mimetype=f"audio/{audio_type}")
    except FileNotFoundError:
        return msg, 404


@track_bp.route("/sample")
def get_sample_track():
    """
    Returns a sample track object.
    """

    return instances.tracks_instance.get_song_by_album(
        "Legends Never Die", "Juice WRLD"
    )
