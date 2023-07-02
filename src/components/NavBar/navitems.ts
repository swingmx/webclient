import { Routes } from "@/router";
import useSearchStore from "@/stores/search";

import FolderSvg from "../../assets/icons/folder-1.svg";
import HeartSvg from "../../assets/icons/heart.svg";
import PlaylistSvg from "../../assets/icons/playlist-1.svg";
import QueueSvg from "../../assets/icons/queue.svg";
import SearchSvg from "../../assets/icons/search.svg";
import SettingsSvg from "../../assets/icons/settings.svg";

export const menus = [
  {
    name: "playlists",
    route_name: Routes.playlists,
    icon: PlaylistSvg,
  },
  {
    name: "folders",
    route_name: Routes.folder,
    params: { path: "$home" },
    icon: FolderSvg,
  },

  {
    separator: true,
  },
  {
    name: "favorites",
    route_name: Routes.favorites,
    icon: HeartSvg,
  },
  {
    name: "queue",
    route_name: Routes.queue,
    icon: QueueSvg,
  },
  {
    name: "search",
    route_name: Routes.search,
    params: { page: "tracks" },
    query: () => ({ q: useSearchStore().query }),
    icon: SearchSvg,
  },
  {
    separator: true,
  },
  {
    name: "settings",
    route_name: Routes.settings,
    icon: SettingsSvg,
  },
];
