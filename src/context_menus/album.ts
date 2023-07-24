import { Option } from "@/interfaces";
import album from "@/stores/pages/album";
import queue from "@/stores/queue";

import { AddToQueueIcon, PlayNextIcon, PlusIcon } from "@/icons";
import { getAllPlaylists } from "@/requests/playlists";
import { get_new_playlist_option, separator } from "./utils";

export default async () => {
  const play_next = <Option>{
    label: "Play next",
    action: () => {
      const tracks = album().tracks;
      queue().insertAfterCurrent(tracks);
    },
    icon: PlayNextIcon,
  };

  const add_to_queue = <Option>{
    label: "Add to queue",
    action: () => {
      const tracks = album().tracks;
      queue().addTracksToQueue(tracks);
    },
    icon: AddToQueueIcon,
  };

  async function addToPlaylist() {
    const new_playlist = get_new_playlist_option();
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
    icon: PlusIcon,
  };

  return [play_next, add_to_queue, separator, add_to_playlist];
};
