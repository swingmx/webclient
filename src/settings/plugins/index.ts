import { SettingCategory } from "@/interfaces/settings";
import lyrics from "./lyrics";

import LyricsSvg from "@/assets/icons/lyrics.svg?raw";

export default <SettingCategory>{
  title: "Plugins",
  groups: [
    {
      title: "Lyrics",
      icon: LyricsSvg,
      desc: "Finds and displays lyrics from the internet.",
      settings: lyrics,
      experimental: true,
    },
  ],
};
