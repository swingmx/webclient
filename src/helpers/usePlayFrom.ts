import { NotifType, playSources } from "@/enums";

import useQueue from "@/stores/queue";
import useAlbum from "@/stores/pages/album";
import useArtist from "@/stores/pages/artist";
import usePlaylist from "@/stores/pages/playlist";
import useSettingsStore from "@/stores/settings";
import useTracklist from "@/stores/queue/tracklist";
import { useNotifStore } from "@/stores/notification";

import { getAlbumTracks } from "@/requests/album";
import { getArtistTracks } from "@/requests/artists";

export async function utilPlayFromArtist(index: number = 0) {
  const queue = useQueue();
  const artist = useArtist();
  const tracklist = useTracklist();

  const settings = useSettingsStore();

  if (artist.tracks.length === 0) return;

  if (artist.info.trackcount <= settings.artist_top_tracks_count) {
    tracklist.setFromArtist(
      artist.info.artisthash,
      artist.info.name,
      artist.tracks
    );
    queue.play();
    return;
  }

  const tracks = await getArtistTracks(artist.info.artisthash);

  tracklist.setFromArtist(artist.info.artisthash, artist.info.name, tracks);
  queue.play(index);
}

export async function playFromAlbumCard(albumhash: string, albumname: string) {
  const queue = useQueue();
  const tracklist = useTracklist();

  const tracks = await getAlbumTracks(albumhash);

  if (tracks.length === 0) {
    useNotifStore().showNotification("Album tracks not found", NotifType.Error);
    return;
  }

  tracklist.setFromAlbum(albumname, albumhash, tracks);
  queue.play();
}

export async function playFromArtistCard(
  artisthash: string,
  artistname: string
) {
  const queue = useQueue();
  const tracklist = useTracklist();
  const tracks = await getArtistTracks(artisthash);

  if (tracks.length === 0) {
    useNotifStore().showNotification(
      "Artist tracks not found",
      NotifType.Error
    );
    return;
  }

  tracklist.setFromArtist(artisthash, artistname, tracks);
  queue.play();
}

export const playFrom = async (source: playSources) => {
  const queue = useQueue();
  const tracklist = useTracklist();

  switch (source) {
    case playSources.album: {
      const album = useAlbum();

      tracklist.setFromAlbum(
        album.info.title,
        album.info.albumhash,
        album.srcTracks
      );
      queue.play();
      break;
    }
    case playSources.playlist: {
      const playlist = usePlaylist();

      if (playlist.tracks.length === 0) return;

      tracklist.setFromPlaylist(
        playlist.info.name,
        playlist.info.id,
        playlist.tracks
      );
      queue.play();
      break;
    }

    case playSources.artist:
      utilPlayFromArtist(0);
  }
};
