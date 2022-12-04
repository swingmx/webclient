"""
Contains all the artist(s) routes.
"""
# import urllib
# import requests

from flask import Blueprint, request

# from app import cache, instances, utils
from app.db.store import Store

artist_bp = Blueprint("artist", __name__, url_prefix="/")


@artist_bp.route("/artist/<artisthash>", methods=["GET"])
def get_artist(artisthash: str):
    print(artisthash)
    artist = Store.get_artist_by_hash(artisthash)
    limit = request.args.get("limit")

    if limit is None:
        limit = 6

    limit = int(limit)

    if artist is None:
        return {"error": "Artist not found"}, 404

    tracks = Store.get_tracks_by_artist(artist.name)
    artist.trackcount = len(tracks)

    albums = Store.get_albums_by_artist(artist.name)
    artist.albumcount = len(albums)

    artist.duration = sum(t.duration for t in tracks)

    return {"artist": artist, "tracks": tracks[:5], "albums": albums[:limit]}


# @artist_bp.route("/artist/<artist>")
# @cache.cached()
# def get_artist_data(artist: str):
#     """Returns the artist's data, tracks and albums"""
#     artist = urllib.parse.unquote(artist)
#     artist_obj = instances.artist_instance.get_artists_by_name(artist)

#     def get_artist_tracks():
#         songs = instances.tracks_instance.find_songs_by_artist(artist)

#         return songs

#     artist_songs = get_artist_tracks()
#     songs = utils.remove_duplicates(artist_songs)

#     def get_artist_albums():
#         artist_albums = []
#         albums_with_count = []

#         albums = instances.tracks_instance.find_songs_by_albumartist(artist)

#         for song in albums:
#             if song["album"] not in artist_albums:
#                 artist_albums.append(song["album"])

#         for album in artist_albums:
#             count = 0
#             length = 0

#             for song in artist_songs:
#                 if song["album"] == album:
#                     count = count + 1
#                     length = length + song["length"]

#             album_ = {"title": album, "count": count, "length": length}

#             albums_with_count.append(album_)

#         return albums_with_count

#     return {
#         "artist": artist_obj,
#         "songs": songs,
#         "albums": get_artist_albums()
#     }
