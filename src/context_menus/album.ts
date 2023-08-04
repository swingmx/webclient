import modal from "@/stores/modal";
import queue from "@/stores/queue";
import album from "@/stores/pages/album";

import { Option, Playlist } from "@/interfaces";
import { addAlbumToPlaylist } from "@/requests/playlists";
import { getAddToPlaylistOptions, separator } from "./utils";
import { AddToQueueIcon, PlayNextIcon, PlaylistIcon, PlusIcon } from "@/icons";

export default async () => {
  const play_next = <Option>{
    label: "Play next",
    action: () => {
      const tracks = album().tracks.filter(
        (track) => !track.is_album_disc_number
      );
      queue().insertAfterCurrent(tracks);
    },
    icon: PlayNextIcon,
  };

  const add_to_queue = <Option>{
    label: "Add to queue",
    action: () => {
      const tracks = album().tracks.filter(
        (track) => !track.is_album_disc_number
      );
      queue().addTracksToQueue(tracks);
    },
    icon: AddToQueueIcon,
  };

  // Action for each playlist option
  const AddToPlaylistAction = (playlist: Playlist) => {
    const store = album();
    addAlbumToPlaylist(playlist, store.info.albumhash);
  };

  const add_to_playlist: Option = {
    label: "Add to Playlist",
    children: await getAddToPlaylistOptions(AddToPlaylistAction),
    icon: PlusIcon,
  };

  const save_as_playlist: Option = {
    label: "Save as Playlist",
    action: () => {
      const modal_s = modal();
      const album_s = album();
      modal_s.showSaveAlbumAsPlaylistModal(
        album_s.info.title,
        album_s.info.albumhash
      );
    },
    icon: PlaylistIcon,
  };

  return [
    play_next,
    add_to_queue,
    separator,
    add_to_playlist,
    save_as_playlist,
  ];
};
