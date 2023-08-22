import { useRoute } from "vue-router";

import { Artist, Playlist, Track } from "@/interfaces";
import { router as Router, Routes } from "@/router";

import { Option } from "@/interfaces";
import { openInFiles } from "@/requests/folders";
import { addTracksToPlaylist, removeTracks } from "@/requests/playlists";

import {
  AddToQueueIcon,
  AlbumIcon,
  ArtistIcon,
  DeleteIcon,
  FolderIcon,
  PlayNextIcon,
  PlusIcon,
} from "@/icons";
import usePlaylistStore from "@/stores/pages/playlist";
import useQueueStore from "@/stores/queue";
import { getAddToPlaylistOptions, separator } from "./utils";

/**
 * Returns a list of context menu items for a track.
 * @param  {any} track a track object.
 * @return {Array<Option>()} a list of context menu items.
 */

export default async (
  track: Track,
  route: ReturnType<typeof useRoute>,
  on_playlist = false
): Promise<Option[]> => {
  const single_artist = track.artists.length === 1;
  const single_album_artist = track.albumartists.length === 1;

  const goToArtist = (artists: Artist[]) => {
    if (artists.length === 1) {
      return false;
    }

    return artists.map((artist) => {
      return <Option>{
        label: artist.name,
        action: () =>
          Router.push({
            name: Routes.artist,
            params: {
              hash: artist.artisthash,
            },
          }),
      };
    });
  };

  const AddToPlaylistAction = (playlist: Playlist) => {
    addTracksToPlaylist(playlist, [track]).then((success) => {
      if (
        !(
          route.name == Routes.playlist &&
          parseInt(route.params.pid as string) == playlist.id
        )
      )
        return;

      if (!success) return;
      const store = usePlaylistStore();
      store.addTrack(track);
      store.fetchAll(parseInt(route.params.pid as string), true);
    });
  };

  const add_to_playlist: Option = {
    label: "Add to Playlist",
    children: await getAddToPlaylistOptions(AddToPlaylistAction, {
      trackhash: track.trackhash,
      playlist_name: track.title + ' Radio',
    }),
    icon: PlusIcon,
  };

  const add_to_q: Option = {
    label: "Add to Queue",
    action: () => {
      useQueueStore().addTrackToQueue(track);
    },
    icon: AddToQueueIcon,
  };

  const play_next: Option = {
    label: "Play next",
    action: () => {
      useQueueStore().playTrackNext(track);
    },
    icon: PlayNextIcon,
  };

  const go_to_folder: Option = {
    label: "Go to Folder",
    action: () => {
      Router.push({
        name: Routes.folder,
        params: { path: track.folder },
      });
    },
    icon: FolderIcon,
  };

  const go_to_artist: Option = {
    label: `Go to Artist`,
    icon: ArtistIcon,
    action: () => {
      single_artist
        ? Router.push({
            name: Routes.artist,
            params: {
              hash: track.artists[0].artisthash,
            },
          })
        : null;
    },
    children: goToArtist(track.artists),
  };

  const go_to_alb_artist: Option = {
    label: `Go to Album Artist`,
    action: () => {
      single_album_artist
        ? Router.push({
            name: Routes.artist,
            params: {
              hash: track.albumartists[0].artisthash,
            },
          })
        : null;
    },
    icon: ArtistIcon,
    children: goToArtist(track.albumartists),
  };

  const open_in_explorer: Option = {
    label: "Open in files",
    action: () => {
      openInFiles(track.filepath || track.folder || "");
    },
    icon: FolderIcon,
  };

  const go_to_album: Option = {
    label: "Go to Album",
    action: () => {
      Router.push({
        name: Routes.album,
        params: { albumhash: track.albumhash },
      });
    },
    icon: AlbumIcon,
  };

  // const del_track: Option = {
  //   label: "Delete Track",
  //   action: () => console.log("Delete Track"),
  //   icon: DeleteIcon,
  //   critical: true,
  // };

  const getRemoveFromPlaylistOption = () =>
    <Option>{
      label: "Remove From Playlist",
      action: () => {
        removeTracks(parseInt(route.params.pid as string), [
          { trackhash: track.trackhash, index: track.index },
        ]).then(() => {
          const store = usePlaylistStore();
          store.removeTrackByIndex(track.index);
          store.fetchAll(parseInt(route.params.pid as string), true);
        });
      },
      icon: DeleteIcon,
      critical: true,
    };

  const options: Option[] = [
    play_next,
    add_to_q,
    separator,
    add_to_playlist,
    separator,
    go_to_album,
    go_to_folder,
    separator,
    go_to_artist,
    go_to_alb_artist,
    separator,
    open_in_explorer,
    // separator,
    // del_track,
  ];

  if (route.name === Routes.playlist && on_playlist) {
    options.splice(4, 0, getRemoveFromPlaylistOption());
  }

  return options;
};

// TODO: Find a way to fetch playlists lazily. ie. When the "Add to playlist" option is triggered.
