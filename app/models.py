"""
Contains all the models for objects generation and typing.
"""
import json

from dataclasses import dataclass

# from operator import itemgetter

from app import utils


@dataclass(slots=True)
class Track:
    """
    Track class
    """

    id: int
    album: str
    albumartist: str
    albumhash: str
    albumid: int
    artist: str | list[str]
    bitrate: int
    copyright: str
    date: str
    disc: int
    duration: int
    filepath: str
    folder: str
    genre: str
    title: str
    track: int
    trackhash: str

    filetype: str = ""
    image: str = ""

    def __post_init__(self):
        if self.artist is not None:
            self.artist = str(self.artist).split(", ")

        self.filetype = self.filepath.rsplit(".", maxsplit=1)[-1]
        self.image = self.albumhash + ".webp"


@dataclass(slots=True)
class Artist:
    """
    Artist class
    """

    name: str
    image: str

    def __init__(self, name: str):
        self.name = name
        self.image = utils.create_safe_name(name) + ".webp"


@dataclass
class Album:
    """
    Creates an album object
    """

    id: int
    albumartist: str
    albumartistid: int
    albumhash: str
    colors: str | list[str]
    copyright: str
    date: int
    title: str

    albumartisthash: str = ""
    image: str = ""
    artistimg: str = ""
    count: int = 0
    duration: int = 0
    is_soundtrack: bool = False
    is_compilation: bool = False
    is_single: bool = False

    def __post_init__(self):
        self.image = self.albumhash + ".webp"
        self.albumartisthash = utils.create_safe_name(self.albumartist)
        self.artistimg = self.albumartisthash + ".webp"
        # (
        #     self.title,
        #     self.artist,
        #     self.date,
        #     self.image,
        #     self.hash,
        #     self.copyright,
        #     self.artistimg,
        # ) = itemgetter(
        #     "title", "artist", "date", "image", "hash", "copyright", "artistimg"
        # )(
        #     tags
        # )

        # try:
        #     self.colors = tags["colors"]
        # except KeyError:
        #     self.colors = []

    # @property
    # def is_soundtrack(self) -> bool:
    #     keywords = ["motion picture", "soundtrack"]
    #     for keyword in keywords:
    #         if keyword in self.title.lower():
    #             return True

    #     return False

    # @property
    # def is_compilation(self) -> bool:
    #     return "various artists" in self.albumartist.lower()


@dataclass
class Playlist:
    """Creates playlist objects"""

    id: int
    artistids: str | list[str]
    image: str
    last_updated: str
    name: str
    trackids: str | list[str]

    thumb: str = ""
    count: int = 0


    # def __init__(self, data):
    #     self.id = data["_id"]["$oid"]
    #     self.tracks = []
    #     self.pretracks = data["pre_tracks"]
    #     self.count = len(self.pretracks)
    #     self.write_props(data)

    def __post_init__(self):
        self.trackids = json.loads(str(self.trackids))
        self.artistids = json.loads(str(self.artistids))

        self.count = len(self.trackids)

        if self.image is not None:
            self.thumb = "thumb_" + self.image
        else:
            self.image = "None"
            self.thumb = "None"

    # def update_playlist(self, data: dict):
    #     self.write_props(data)

    # TODO: Find a better name for this method
    # def write_props(self, data: dict):
    #     (self.name, self.image, self.thumb, self.last_updated,) = itemgetter(
    #         "name",
    #         "image",
    #         "thumb",
    #         "last_updated",
    #     )(data)


@dataclass
class Folder:
    name: str
    path: str
    trackcount: int
    is_sym: bool = False
    """The number of tracks in the folder"""

    def __init__(self, data) -> None:
        self.name = data["name"]
        self.path = data["path"]
        self.is_sym = data["is_sym"]
        self.trackcount = data["trackcount"]
