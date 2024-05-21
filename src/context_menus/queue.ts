import useQueue from "@/stores/queue";
import useModalStore from "@/stores/modal";
import useTracklist, { From } from "@/stores/queue/tracklist";

import { FromOptions } from "@/enums";
import { Option, Playlist } from "@/interfaces";
import { getAddToPlaylistOptions } from "./utils";
import { addTracksToPlaylist } from "@/requests/playlists";
import { DeleteIcon, PlaylistIcon, PlusIcon } from "@/icons";

function getQueueName(from: From) {
  switch (from.type) {
    case FromOptions.album:
      return from.name;
    case FromOptions.artist:
      return `This is ${from.artisthash}`;
    case FromOptions.folder:
      return from.name;
    case FromOptions.playlist:
      return `${from.name} 2.0`;
    case FromOptions.search:
      return `Search results for ${from.query}`;
    case FromOptions.favorite:
      return `Favorites`;
    default:
      return "";
  }
}

export default async () => {
  const store = useTracklist();

  const clearQueue: Option = {
    label: "Clear queue",
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
    label: "Add queue to playlist",
    children: () => getAddToPlaylistOptions(AddToPlaylistAction, {
      trackhash: store.tracklist.map((t) => t.trackhash).join(","),
      playlist_name: getQueueName(store.from),
    }),
    icon: PlusIcon,
  };

  return [clearQueue, addToPlaylist];
};
