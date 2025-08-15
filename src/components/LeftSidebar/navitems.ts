import { useI18n } from "vue-i18n";
import { Routes } from "@/router";
import useDialog from "@/stores/modal";
import useSearch from "@/stores/search";

import FolderSvg from "@/assets/icons/folder-1.svg";
import HeartSvg from "@/assets/icons/heart.svg";
import PlaylistSvg from "@/assets/icons/playlist-1.svg";
import SearchSvg from "@/assets/icons/search.svg";
import SettingsSvg from "@/assets/icons/settings.svg";
import HomeSvg from "@/assets/icons/home.svg";

export const useNavItems = () => {
  const { t } = useI18n();

  const folder = {
    name: t('LeftSidebar.NavItems.Folder'),
    route_name: Routes.folder,
    params: { path: "$home" },
    icon: FolderSvg,
  };

  const favorites = {
    name: t('LeftSidebar.NavItems.Favorites'),
    route_name: Routes.favorites,
    icon: HeartSvg,
  };

  const playlists = {
    name: t('LeftSidebar.NavItems.Playlists'),
    route_name: Routes.playlists,
    icon: PlaylistSvg,
  };

  const home = {
    name: t('LeftSidebar.NavItems.Home'),
    route_name: Routes.Home,
    icon: HomeSvg,
  };

  const menus = [
    home,
    folder,
    {
      name: t('LeftSidebar.NavItems.Search'),
      route_name: Routes.search,
      params: { page: "top" },
      query: () => ({ q: useSearch().query }),
      icon: SearchSvg,
    },
    {
      separator: true,
    },
    favorites,
    playlists,
    {
      separator: true,
    },
    {
      name: t('LeftSidebar.NavItems.Settings'),
      route_name: null,
      icon: SettingsSvg,
      action: () => {
        useDialog().showSettingsModal()
      }
    },
  ];

  const topnavitems = [home, folder, favorites, playlists];
  
  return { menus, topnavitems };
};