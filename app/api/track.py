"""
Contains all the track routes.
"""
from flask import Blueprint, send_file

from app.db.sqlite.tracks import SQLiteTrackMethods

trackbp = Blueprint("track", __name__, url_prefix="/")

get_track_by_hash = SQLiteTrackMethods.get_track_by_trackhash


@trackbp.route("/file/<trackhash>")
def send_track_file(trackhash: str):
    """
    Returns an audio file that matches the passed id to the client.
    Falls back to track hash if id is not found.
    """
    msg = {"msg": "File Not Found"}
    if trackhash is None:
        return msg, 404

    track = get_track_by_hash(trackhash)

    if track is None:
        return msg, 404

    audio_type = track.filepath.rsplit(".", maxsplit=1)[-1]

    try:
        return send_file(track.filepath, mimetype=f"audio/{audio_type}")
    except FileNotFoundError:
        return msg, 404
