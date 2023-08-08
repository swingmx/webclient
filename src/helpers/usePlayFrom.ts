import { NotifType, playSources } from "@/enums";

import { useNotifStore } from "@/stores/notification";
import useAStore from "@/stores/pages/album";
import useArtistPageStore from "@/stores/pages/artist";
import useFStore from "@/stores/pages/folder";
import usePStore from "@/stores/pages/playlist";
import useQStore from "@/stores/queue";
import useSettingsStore from "@/stores/settings";

import { getAlbumTracks } from "@/requests/album";
import { getArtistTracks } from "@/requests/artists";

export async function utilPlayFromArtist(
  queue: typeof useQStore,
  artist: typeof useArtistPageStore,
  index: number = 0
) {
  const qu = queue();
  const ar = artist();
  const settings = useSettingsStore();

  if (ar.tracks.length === 0) return;

  if (ar.info.trackcount <= settings.artist_top_tracks_count) {
    qu.playFromArtist(ar.info.artisthash, ar.info.name, ar.tracks);
    qu.play();
    return;
  }

  const tracks = await getArtistTracks(ar.info.artisthash);

  qu.playFromArtist(ar.info.artisthash, ar.info.name, tracks);
  qu.play(index);
}

export async function playFromAlbumCard(albumhash: string, albumname: string) {
  const qu = useQStore();

  const tracks = await getAlbumTracks(albumhash);

  if (tracks.length === 0) {
    useNotifStore().showNotification("Album tracks not found", NotifType.Error);
    return;
  }

  qu.playFromAlbum(albumname, albumhash, tracks);
  qu.play();
}

export async function playFromArtistCard(
  artisthash: string,
  artistname: string
) {
  const queue = useQStore();
  const tracks = await getArtistTracks(artisthash);

  if (tracks.length === 0) {
    useNotifStore().showNotification(
      "Artist tracks not found",
      NotifType.Error
    );
    return;
  }

  queue.playFromArtist(artisthash, artistname, tracks);
  queue.play();
}

export const playFrom = async (source: playSources) => {
  const useQueue = useQStore();

  switch (source) {
    case playSources.album:
      const a_store = useAStore();

      useQueue.playFromAlbum(
        a_store.info.title,
        a_store.info.albumhash,
        a_store.srcTracks
      );
      useQueue.play();
      break;
    case playSources.playlist:
      const p = usePStore();

      if (p.tracks.length === 0) return;

      useQueue.playFromPlaylist(p.info.name, p.info.id, p.tracks);
      useQueue.play();
      break;

    case playSources.artist:
      utilPlayFromArtist(useQStore, useArtistPageStore, 0);
  }
};
