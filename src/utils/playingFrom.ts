import { Routes } from "@/router";
import { From } from "@/stores/queue";
import { FromOptions } from "@/composables/enums";

import AlbumSvg from "@/assets/icons/album.svg";
import ArtistSvg from "@/assets/icons/artist.svg";
import FolderSvg from "@/assets/icons/folder.svg";
import PlaylistSvg from "@/assets/icons/playlist.svg";
import SearchSvg from "@/assets/icons/search.svg";
import HeartSvg from "@/assets/icons/heart.fill.svg";
import { paths } from "@/config";

export default (source: From) => {
  switch (source.type) {
    case FromOptions.album:
      return {
        name: source.name,
        icon: AlbumSvg,
        location: {
          name: Routes.album,
          params: {
            hash: source.albumhash,
          },
        },
        image: paths.images.thumb.small + source.albumhash,
      };

    case FromOptions.folder:
      return {
        name: source.name,
        icon: FolderSvg,
        location: {
          name: Routes.folder,
          params: {
            path: source.path,
          },
        },
        image: "",
      };

    case FromOptions.playlist:
      return {
        name: source.name,
        icon: PlaylistSvg,
        location: {
          name: Routes.playlist,
          params: {
            pid: source.id,
          },
        },
        image: paths.images.playlist + source.id,
      };

    case FromOptions.search:
      return {
        name: `Search for: "${source.query}"`,
        icon: SearchSvg,
        location: {
          name: Routes.search,
          params: {
            query: source.query,
            page: "tracks",
          },
        },
        image: "",
      };

    case FromOptions.artist:
      return {
        name: source.artistname,
        icon: ArtistSvg,
        location: {
          name: Routes.artist,
          params: {
            hash: source.artisthash,
          },
        },
        image: paths.images.artist.small + source.artisthash,
      };

    case FromOptions.favorite:
      return {
        name: "Favorite tracks",
        icon: HeartSvg,
        location: {
          name: Routes.favoriteTracks,
        },
        image: "",
      };

    default:
      return { name: "👻 No source", location: {} };
  }
};
