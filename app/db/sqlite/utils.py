from app.models import Album, Track


def tuples_to_tracks(tracks: list[tuple]):
    for track in tracks:
        yield Track(*track)


def tuples_to_albums(albums: list[tuple]):
    for album in albums:
        yield Album(*album)
