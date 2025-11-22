import useQueue from "@/stores/queue";
import useModalStore from "@/stores/modal";
import useTracklist, { From } from "@/stores/queue/tracklist";

import { FromOptions } from "@/enums";
import { Option, Playlist } from "@/interfaces";
import { getAddToPlaylistOptions } from "./utils";
import { addTracksToPlaylist } from "@/requests/playlists";
import { DeleteIcon, PlaylistIcon, PlusIcon } from "@/icons";
import { getT } from "@/i18n";

const { t } = getT();

function getQueueName(from: From) {
  switch (from.type) {
    case FromOptions.album:
      return from.name;
    case FromOptions.artist:
      return t('Menus.Queue.ArtistName', {hash: from.artisthash});
    case FromOptions.folder:
      return from.name;
    case FromOptions.playlist:
      return t('Menus.Queue.PlaylistName', {name: from.name});
    case FromOptions.search:
      return t('Menus.Queue.SearchName', {query: from.query});
    case FromOptions.favorite:
      return t('Menus.Queue.FavoritesName');
    default:
      return "";
  }
}

export default async () => {
  const store = useTracklist();

  const clearQueue: Option = {
    label: t('Menus.Queue.ClearQueue'),
    action: () => {
      useQueue().clearQueue();
    },
    icon: DeleteIcon,
    critical: true,
  };

  const AddToPlaylistAction = (playlist: Playlist) => {
    addTracksToPlaylist(playlist, store.tracklist);
  };

  const addToPlaylist: Option = {
    label: t('Menus.Queue.AddQueueToPlaylist'),
    children: () => getAddToPlaylistOptions(AddToPlaylistAction, {
      trackhash: store.tracklist.map((t) => t.trackhash).join(","),
      playlist_name: getQueueName(store.from),
    }),
    icon: PlusIcon,
  };

  return [clearQueue, addToPlaylist];
};
