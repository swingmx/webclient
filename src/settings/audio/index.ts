import { SettingCategory } from "@/interfaces/settings";
import gapless from "./groups";

export default {
  title: "Audio",
  groups: [
    {
      title: "Playback",
      desc: "Settings related to audio playback",
      settings: [...gapless],
    },
  ],
} as SettingCategory;
