"""
This module creates and initiliazes a MongoDB instance. It also contains the
`convert_one()` and `conver_many()` methods for converting MongoDB cursors to Python dicts.
"""
import json
from typing import List

import pymongo
from bson import json_util

from app.db import AlbumMethods, ArtistMethods, PlaylistMethods, TrackMethods
from app.models import Track

db_name = "ALICE_SERVER"


class Mongo:
    """
    The base class for all mongodb classes.
    """

    def __init__(self, database):
        mongo_uri = pymongo.MongoClient()
        self.db = mongo_uri[database]


class MongoAlbums(Mongo, AlbumMethods):
    def __init__(self):
        super(MongoAlbums, self).__init__(db_name)
        self.collection = self.db["ALBUMS"]


class MongoArtists(Mongo, ArtistMethods):
    def __init__(self):
        super(MongoArtists, self).__init__(db_name)
        self.collection = self.db["ARTISTS"]


class MongoPlaylists(Mongo, PlaylistMethods):
    def __init__(self):
        super(MongoPlaylists, self).__init__(db_name)
        self.collection = self.db["PLAYLISTS"]


class MongoTracks(Mongo, TrackMethods):
    def __init__(self):
        super(MongoTracks, self).__init__(db_name)
        self.collection = self.db["TRACKS"]


# ====================================================================== #
# cursor convertion methods


def convert_one(song):
    """
    Converts a single mongodb cursor to a json object.
    """
    t = json.dumps(song, default=json_util.default)
    track: Track = json.loads(t)

    return track


def convert_many(array):
    """
    Converts a list of mongodb cursors to a list of json objects.
    """

    songs: List[Track] = []

    for song in array:
        t = json.dumps(song, default=json_util.default)
        track: Track = json.loads(t)

        songs.append(track)

    return songs
