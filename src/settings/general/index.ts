import { SettingCategory } from "@/interfaces/settings";
import * as strings from "../strings";
import contextChildrenShowMode from "./context-children-show-mode";
import extendWidth from "./extend-width";
import nowPlaying from "./now-playing-group";
import sidebarSettings from "./sidebar";
import rootDirSettings from "./root-dirs";

const npStrings = strings.nowPlayingStrings;
const rootRootStrings = strings.manageRootDirsStrings;

export default {
  title: "General",
  groups: [
    {
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
  ],
} as SettingCategory;
