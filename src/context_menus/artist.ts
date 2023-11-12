import modal from "@/stores/modal";
import queue from "@/stores/queue";

import { getArtistTracks } from "@/requests/artists";
import { addArtistToPlaylist } from "@/requests/playlists";

import { Option, Playlist } from "@/interfaces";
import { getAddToPlaylistOptions, get_find_on_social } from "./utils";
import { AddToQueueIcon, PlayNextIcon, PlaylistIcon, PlusIcon } from "@/icons";

export default async (artisthash: string, artistname: string) => {
  const play_next = <Option>{
    label: "Play next",
    action: () => {
      getArtistTracks(artisthash).then((tracks) => {
        const store = queue();
        store.insertAfterCurrent(tracks);
      });
    },
    icon: PlayNextIcon,
  };

  const add_to_queue = <Option>{
    label: "Add to queue",
    action: () => {
      getArtistTracks(artisthash).then((tracks) => {
        const store = queue();
        store.addTracksToQueue(tracks);
      });
    },
    icon: AddToQueueIcon,
  };

  // Action for each playlist option
  const AddToPlaylistAction = (playlist: Playlist) => {
    addArtistToPlaylist(playlist, artisthash);
  };

  const add_to_playlist: Option = {
    label: "Add to Playlist",
    children: await getAddToPlaylistOptions(AddToPlaylistAction, {
      artisthash,
    }),
    icon: PlusIcon,
  };

  const save_as_playlist: Option = {
    label: "Save as Playlist",
    action: () => {
      const store = modal();
      store.showSaveArtistAsPlaylistModal(artistname, artisthash);
    },
    icon: PlaylistIcon,
  };

  return [
    play_next,
    add_to_queue,
    add_to_playlist,
    save_as_playlist,
    get_find_on_social("artist"),
  ];
};
