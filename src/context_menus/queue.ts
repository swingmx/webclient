import { DeleteIcon, PlaylistIcon, PlusIcon } from "@/icons";
import { Option, Playlist } from "@/interfaces";
import { addTracksToPlaylist } from "@/requests/playlists";
import useModalStore from "@/stores/modal";
import useQueueStore, { From } from "@/stores/queue";
import { getAddToPlaylistOptions } from "./utils";
import { FromOptions, playSources } from "@/enums";

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
  const queue = useQueueStore();

  const clearQueue: Option = {
    label: "Clear queue",
    action: () => {
      useQueueStore().clearQueue();
    },
    icon: DeleteIcon,
  };

  const saveAsPlaylist: Option = {
    label: "Save as playlist",
    action: () => {
      useModalStore().showSaveQueueAsPlaylistModal(getQueueName(queue.from));
    },
    icon: PlaylistIcon,
  };

  const AddToPlaylistAction = (playlist: Playlist) => {
    addTracksToPlaylist(playlist, queue.tracklist);
  };

  const addToPlaylist: Option = {
    label: "Add to Playlist",
    children: await getAddToPlaylistOptions(AddToPlaylistAction, {
      trackhash: queue.tracklist.map((t) => t.trackhash).join(","),
    }),
    icon: PlusIcon,
  };

  return [clearQueue, addToPlaylist, saveAsPlaylist];
};
