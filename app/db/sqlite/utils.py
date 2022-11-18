from app.models import Track


def tuples_to_tracks(tracks: list[tuple]):
    for track in tracks:
        yield Track(*track)
