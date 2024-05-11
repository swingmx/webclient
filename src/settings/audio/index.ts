import { SettingCategory } from "@/interfaces/settings";
import gapless from "./groups";

import VolumeSvg from "@/assets/icons/volume-mid.svg?raw"

export default {
  title: "Audio",
  groups: [
    {
      title: "Playback",
      icon: VolumeSvg,
      desc: "Settings related to audio playback",
      settings: [...gapless],
    },
  ],
} as SettingCategory;
