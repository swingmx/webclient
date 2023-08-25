import { SettingCategory } from "@/interfaces/settings";
import * as strings from "../strings";
import contextChildrenShowMode from "./context-children-show-mode";
import extendWidth from "./extend-width";
import nowPlaying from "./now-playing-group";
import sidebarSettings from "./sidebar";
import rootDirSettings from "./root-dirs";
import albums from "./albums";
import separators from "./separators";
import useSettingsStore from "@/stores/settings";

const npStrings = strings.nowPlayingStrings;
const rootRootStrings = strings.manageRootDirsStrings;

export default {
  title: "General",
  groups: [
    {
      title: "General Settings",
      desc: "Settings for various parts of the user interface.",
      settings: [
        ...sidebarSettings,
        ...extendWidth,
        ...contextChildrenShowMode,
      ],
    },
    {
      title: npStrings.title,
      desc: npStrings.desc,
      settings: [...nowPlaying],
    },
    {
      title: rootRootStrings.title,
      desc: rootRootStrings.desc,
      settings: [...rootDirSettings],
    },
    {
      // null means settings table is not created yet
      show_if: () => useSettingsStore().feat !== null,
      title: "Album and tracks",
      desc: "Settings relating to tracks and album titles",
      settings: [...albums],
    },
    {
      // null means settings table is not created yet
      show_if: () => useSettingsStore().feat !== null,
      title: "Separators",
      desc: "Customize artist separators",
      settings: [separators],
    },
  ],
} as SettingCategory;
