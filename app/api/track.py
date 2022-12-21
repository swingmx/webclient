"""
Contains all the track routes.
"""
from flask import Blueprint, Response
from app.db.store import Store

trackbp = Blueprint("track", __name__, url_prefix="/")


def stream_file(filepath: str):
    """
    Streams a file to the client.
    """
    with open(filepath, "rb") as file:
        data = file.read(1024)
        while data:
            yield data
            data = file.read(1024)


@trackbp.route("/file/<trackhash>")
def send_track_file(trackhash: str):
    """
    Returns an audio file that matches the passed id to the client.
    Falls back to track hash if id is not found.
    """
    msg = {"msg": "File Not Found"}
    if trackhash is None:
        return msg, 404

    try:
        track = Store.get_tracks_by_trackhashes([trackhash])[0]
    except IndexError:
        track = None

    if track is None:
        return msg, 404

    audio_type = track.filepath.rsplit(".", maxsplit=1)[-1]
    return Response(stream_file(track.filepath), mimetype=f"audio/{audio_type}")
