import colorgram

from app import settings

from app.logger import get_logger
from app.models import Album

from app.db.sqlite.albums import SQLiteAlbumMethods as db

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
    def __init__(self) -> None:
        log.info("Started processing album colors")
        all_albums = db.get_all_albums()

        process_count = 0

        if all_albums is None:
            return

        for album in all_albums:
            if len(album.colors) != 0:
                pass

            self.process_color(album)
            process_count += 1

        log.info("Processing album colors ... ✅")

    @staticmethod
    def process_color(album: Album):
        img = settings.SM_THUMB_PATH + "/" + album.image

        colors = get_image_colors(img)

        if len(colors) > 0:
            db.update_album_colors(album.albumhash, colors)

        return colors
