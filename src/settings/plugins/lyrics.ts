import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import useSettings from "@/stores/settings";

const toggle_lyrics_plugin = <Setting>{
  title: "Enable plugin",
  type: SettingType.binary,
  state: () => useSettings().use_lyrics_plugin,
  action: () => useSettings().toggleLyricsPlugin(),
};

export default [toggle_lyrics_plugin];
