import colorgram
from tqdm import tqdm
from pathlib import Path

from app import settings
from app.db.store import Store
from app.logger import get_logger
from app.models import Album, Artist


from app.db.sqlite.albums import SQLiteAlbumMethods as db
from app.db.sqlite.artists import SQLiteArtistMethods as adb

log = get_logger()


def get_image_colors(image: str) -> list[str]:
    """Extracts 2 of the most dominant colors from an image."""
    try:
        colors = sorted(colorgram.extract(image, 1), key=lambda c: c.hsl.h)
    except OSError:
        return []

    formatted_colors = []

    for color in colors:
        color = f"rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})"
        formatted_colors.append(color)

    return formatted_colors


class ProcessAlbumColors:
    """
    Extracts the most dominant color from the album art and saves it to the database.
    """

    def __init__(self) -> None:
        all_albums = Store.albums

        process_count = 0

        if all_albums is None:
            return

        for album in tqdm(all_albums, desc="Processing album colors"):
            if len(album.colors) == 0:
                self.process_color(album)
                process_count += 1

    @staticmethod
    def process_color(album: Album):
        img = settings.SM_THUMB_PATH + "/" + album.image

        colors = get_image_colors(img)

        if len(colors) > 0:
            db.update_album_colors(album.albumhash, colors)

        return colors


class ProcessArtistColors:
    """
    Extracts the most dominant color from the artist art and saves it to the database.
    """

    def __init__(self) -> None:
        all_artists = Store.artists

        if all_artists is None:
            return

        for artist in tqdm(all_artists, desc="Processing artist colors"):
            if len(artist.colors) == 0:
                self.process_color(artist)

    @staticmethod
    def process_color(artist: Artist):
        path = Path(settings.ARTIST_IMG_PATH).joinpath(artist.image)

        if not path.exists():
            return

        colors = get_image_colors(str(path))

        if len(colors) > 0:
            adb.insert_one_artist(artisthash=artist.artisthash, colors=colors)
