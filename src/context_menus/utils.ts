import modal from "@/stores/modal";

import { Option, Playlist, Track } from "@/interfaces";
import { getAllPlaylists } from "@/requests/playlists";

export const separator: Option = {
  type: "separator",
};

export function get_new_playlist_option(new_playlist_modal_props: any = {}): Option {
  return {
    label: "New playlist",
    action: () => {
      modal().showNewPlaylistModal(new_playlist_modal_props);
    },
  };
}

type action = (playlist: Playlist) => void;

/**
 *
 * @param addToPlaylist Function to be called when a playlist is selected
 * @param new_playlist_modal_props Props to be passed to the modal when creating a new playlist
 * @returns A list of options to be used in a context menu
 */
export async function getAddToPlaylistOptions(
  addToPlaylist: action,
  new_playlist_modal_props: any = {}
) {
  const new_playlist = get_new_playlist_option(new_playlist_modal_props);
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
