import { Routes } from "@/router";
import useSearchStore from "@/stores/search";

import FolderSvg from "../../assets/icons/folder-1.svg";
import HeartSvg from "../../assets/icons/heart.svg";
import PlaylistSvg from "../../assets/icons/playlist-1.svg";
import SearchSvg from "../../assets/icons/search.svg";
import SettingsSvg from "../../assets/icons/settings.svg";

export const menus = [
  {
    name: "folders",
    route_name: Routes.folder,
    params: { path: "$home" },
    icon: FolderSvg,
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
    name: "playlists",
    route_name: Routes.playlists,
    icon: PlaylistSvg,
  },
  {
    name: "favorites",
    route_name: Routes.favorites,
    icon: HeartSvg,
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
