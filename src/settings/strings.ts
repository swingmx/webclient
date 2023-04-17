/**
 * Settings data strings
 */
interface S {
  title?: string;
  desc?: string;
  settings: {
    [key: string]: string;
  };
}

export const nowPlayingStrings = {
  title: "Now playing",
  desc: "Settings related to the current song",
  settings: {
    album_art: "Show album art on the left sidebar",
  },
} as S;

export const appWidthStrings = {
  settings: {
    extend: "Extend app to full screen width",
  },
} as S;

export const sidebarStrings = <S>{
  settings: {
    use_sidebar: "Show right sidebar",
  },
};

export const contextChildrenShowModeStrings = <S>{
  settings: {
    show_mode: "Show right click menu dropdowns on",
  },
};

export const showMasterFlag = <S>{
  settings: {
    show_flag: "Show M (Master) flag on tracks with bitrate higher than 1Mbps",
  },
};

export const showFoldersAsStrings = <S>{
  settings: { show_folders_as: "Show folders as" },
};

export const manageRootDirsStrings = <S>{
  title: "Root directories",
  desc: "Settings related to your root directories",
  settings: {
    change: "Change your root directories",
    list_root_dirs: "Current root directories",
  },
};
