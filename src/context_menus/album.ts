import useModal from "@/stores/modal";
import useAlbum from "@/stores/pages/album";
import useTracklist from "@/stores/queue/tracklist";

import { Option, Playlist } from "@/interfaces";
import { addAlbumToPlaylist } from "@/requests/playlists";
import { getAddToPlaylistOptions, get_find_on_social } from "./utils";
import { AddToQueueIcon, PlayNextIcon, PlaylistIcon, PlusIcon } from "@/icons";

export default async () => {
  const album = useAlbum();

  const play_next = <Option>{
    label: "Play next",
    action: () => {
      const tracks = album.tracks.filter(
        (track) => !track.is_album_disc_number
      );
      useTracklist().insertAfterCurrent(tracks);
    },
    icon: PlayNextIcon,
  };

  const add_to_queue = <Option>{
    label: "Add to queue",
    action: () => {
      const tracks = album.tracks.filter(
        (track) => !track.is_album_disc_number
      );
      useTracklist().addTracks(tracks);
    },
    icon: AddToQueueIcon,
  };

  // Action for each playlist option
  const AddToPlaylistAction = (playlist: Playlist) => {
    const store = album;
    addAlbumToPlaylist(playlist, store.info.albumhash);
  };

  const add_to_playlist: Option = {
    label: "Add to Playlist",
    children: () => getAddToPlaylistOptions(AddToPlaylistAction, {
      albumhash: album.info.albumhash,
      playlist_name: album.info.title,
    }),
    icon: PlusIcon,
  };

  return [
    play_next,
    add_to_queue,
    add_to_playlist,
    get_find_on_social(),
  ];
};
