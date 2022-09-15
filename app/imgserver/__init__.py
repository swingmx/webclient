from os import path
from typing import Tuple

from flask import Flask, request, send_from_directory


app = Flask(__name__)


def join(*args: Tuple[str]) -> str:
    return path.join(*args)


HOME = path.expanduser("~")
APP_DIR = join(HOME, ".alice")
IMG_PATH = path.join(APP_DIR, "images")

ASSETS_PATH = join(APP_DIR, "assets")
THUMB_PATH = join(IMG_PATH, "thumbnails")
ARTIST_PATH = join(IMG_PATH, "artists")
PLAYLIST_PATH = join(IMG_PATH, "playlists")
SUPPORTED_IMAGES = (".jpg", ".png", ".webp", ".jpeg")


@app.route("/")
def hello():
    return "Holla"


def send_fallback_img(filename: str = "default.webp"):
    img = join(ASSETS_PATH, filename)
    exists = path.exists(img)

    if not exists:
        return "", 404

    return send_from_directory(ASSETS_PATH, filename)


@app.route("/t/<imgpath>")
def send_thumbnail(imgpath: str):
    fpath = join(THUMB_PATH, imgpath)
    exists = path.exists(fpath)

    if exists:
        return send_from_directory(THUMB_PATH, imgpath)

    return send_fallback_img()


@app.route("/a/<imgpath>")
def send_artist_image(imgpath: str):
    fpath = join(ARTIST_PATH, imgpath)
    exists = path.exists(fpath)

    if exists:
        return send_from_directory(ARTIST_PATH, imgpath)

    return send_fallback_img("artist.webp")


@app.route("/p/<imgpath>")
def send_playlist_image(imgpath: str):
    fpath = join(PLAYLIST_PATH, imgpath)
    exists = path.exists(fpath)

    if exists:
        return send_from_directory(PLAYLIST_PATH, imgpath)

    return send_fallback_img("playlist.svg")


@app.route("/raw")
@app.route("/raw/<path:imgpath>")
def send_from_filepath(imgpath: str = ""):
    imgpath = "/" + imgpath
    filename = path.basename(imgpath)

    def verify_is_image():
        _, ext = path.splitext(filename)
        return ext in SUPPORTED_IMAGES

    verified = verify_is_image()

    if not verified:
        return imgpath, 404

    exists = path.exists(imgpath)

    if verified and exists:
        return send_from_directory(path.dirname(imgpath), filename)

    return imgpath, 404


if __name__ == "__main__":
    app.run(threaded=True, port=1971, host="0.0.0.0")
