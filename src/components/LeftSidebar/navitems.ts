import { Routes } from "@/router";
import useSearchStore from "@/stores/search";
import useSettingsStore from "@/stores/settings";

import FolderSvg from "@/assets/icons/folder-1.svg";
import HeartSvg from "@/assets/icons/heart.svg";
import PlaylistSvg from "@/assets/icons/playlist-1.svg";
import SearchSvg from "@/assets/icons/search.svg";
import SettingsSvg from "@/assets/icons/settings.svg";
import RadioSvg from "@/assets/icons/radio.svg";

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
    params: { page: "top" },
    query: () => ({ q: useSearchStore().query }),
    icon: SearchSvg,
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
    name: "playlists",
    route_name: Routes.playlists,
    icon: PlaylistSvg,
  },
  {
    separator: true,
  },
  {
    name: "Radios",
    route_name: Routes.hidden,
    icon: RadioSvg,
    unlock_key: () => useSettingsStore().hidden_radios_unlocked,
    class: "radiosvg",
  },
  {
    name: "settings",
    route_name: Routes.settings,
    icon: SettingsSvg,
  },
];
