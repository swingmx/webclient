/**
 * Settings data strings
 */

import { getT } from "@/i18n";

const { t } = getT();

interface S {
  title?: string;
  desc?: string;
  settings: {
    [key: string]: string;
  };
}

export const nowPlayingStrings = {
  title: t('Settings.NowPlaying.Title'),
  desc: t("Settings.NowPlaying.Description"),
  settings: {
    album_art: t('Settings.NowPlaying.AlbumArt'),
  },
} as S;

export const appWidthStrings = {
  settings: {
    extend: t("Settings.AppWidth.Extend"),
    extend_desc: t("Settings.AppWidth.ExtendDesc")
  },
} as S;

export const sidebarStrings = <S>{
  settings: {
    use_sidebar: t("Settings.Sidebar.UseSidebar"),
  },
};

export const contextChildrenShowModeStrings = <S>{
  settings: {
    show_mode: t('Settings.ContextChildren.ShowMode'),
  },
};

export const showMasterFlag = <S>{
  settings: {
    show_flag: t('Settings.MasterFlag.Show'),
  },
};

export const showFoldersAsStrings = <S>{
  settings: { show_folders_as: t("Settings.ShowFolders.As")},
};

export const manageRootDirsStrings = <S>{
  title: t("Settings.RootDirs.Title"),
  desc: t("Settings.RootDirs.Description"),
  settings: {
    change: t("Settings.RootDirs.Change"),
    list_root_dirs: t("Settings.RootDirs.Current"),
  },
};
