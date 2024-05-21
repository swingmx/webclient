import modal from "@/stores/modal";
import useTracklist from "@/stores/queue/tracklist";

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
        const store = useTracklist();
        store.insertAfterCurrent(tracks);
      });
    },
    icon: PlayNextIcon,
  };

  const add_to_queue = <Option>{
    label: "Add to queue",
    action: () => {
      getArtistTracks(artisthash).then((tracks) => {
        const store = useTracklist();
        store.addTracks(tracks);
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
    children: () => getAddToPlaylistOptions(AddToPlaylistAction, {
      artisthash,
      playlist_name: `This is ${artistname}`,
    }),
    icon: PlusIcon,
  };

  return [
    play_next,
    add_to_queue,
    add_to_playlist,
    get_find_on_social("artist"),
  ];
};
