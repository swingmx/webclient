"""
Contains all the track routes.
"""
from app import instances
from app import models
from flask import Blueprint
from flask import send_file

track_bp = Blueprint("track", __name__, url_prefix="/")


@track_bp.route("/file/<id_and_hash>")
def send_track_file(id_and_hash: str):
    """
    Returns an audio file that matches the passed id to the client.
    Falls back to track hash if id is not found.
    """
    [trackid, hash] = id_and_hash.split("-")
    track = instances.tracks_instance.get_track_by_id(trackid)

    if track is None:
        track = instances.tracks_instance.find_track_by_hash(hash)

    msg = {"msg": "File Not Found"}

    if track is None:
        return msg, 404

    track = models.Track(**track)
    type = track.filepath.split(".")[-1]

    try:
        return send_file(track.filepath, mimetype=f"audio/{type}")
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
