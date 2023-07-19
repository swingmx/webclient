import { Option } from "@/interfaces";
import queue from "@/stores/queue";
import album from "@/stores/pages/album";
import modal from "@/stores/modal";

import { get_new_playlist_option, separator } from "./utils";
import { getAllPlaylists } from "@/composables/fetch/playlists";

export default async (
  queueStore: typeof queue,
  albumStore: typeof album,
  modalStore: typeof modal
) => {
  const play_next = <Option>{
    label: "Play next",
    action: () => {
      const tracks = albumStore().tracks;
      queueStore().insertAfterCurrent(tracks);
    },
    icon: "play_next",
  };

  const add_to_queue = <Option>{
    label: "Add to queue",
    action: () => {
      const tracks = albumStore().tracks;
      queueStore().addTracksToQueue(tracks);
    },
    icon: "add_to_queue",
  };

  async function addToPlaylist() {
    console.log("addToPlaylist");
    const new_playlist = get_new_playlist_option(modalStore);
    const p = await getAllPlaylists(true);

    let items = [new_playlist];

    if (p.length === 0) {
      return items;
    }

    let playlists = <Option[]>[];

    playlists = p.map((playlist) => {
      return <Option>{
        label: playlist.name,
        action: () => {
          () => {};
        },
      };
    });

    return [...items, separator, ...playlists];
  }

  const add_to_playlist: Option = {
    label: "Add to Playlist",
    children: await addToPlaylist(),
    icon: "plus",
  };

  return [play_next, add_to_queue, separator, add_to_playlist];
};
