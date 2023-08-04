import modal from "@/stores/modal";

import { Option, Playlist, Track } from "@/interfaces";
import { getAllPlaylists } from "@/requests/playlists";

export const separator: Option = {
  type: "separator",
};

export function get_new_playlist_option(track?: Track): Option {
  return {
    label: "New playlist",
    action: () => {
      modal().showNewPlaylistModal(track);
    },
  };
}

type action = (playlist: Playlist) => void;

export async function getAddToPlaylistOptions(addToPlaylist: action) {
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
        addToPlaylist(playlist);
      },
    };
  });

  return [...items, separator, ...playlists];
}
