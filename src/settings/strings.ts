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
  desc: "Settings relating to the current song",
  settings: {
    album_art: "Show album art on the left sidebar",
  },
} as S;

export const appWidthStrings = {
  settings: {
    extend: "Full width",
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
    show_flag: "Master flag",
  },
};

export const showFoldersAsStrings = <S>{
  settings: { show_folders_as: "Show folders as" },
};

export const manageRootDirsStrings = <S>{
  title: "Root directories",
  desc: "Settings relating to your root directories",
  settings: {
    change: "Change your root directories",
    list_root_dirs: "Current root directories",
  },
};
