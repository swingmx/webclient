import { Setting } from "@/interfaces/settings";
import { SettingType } from "../enums";

import useSettings from "@/stores/settings";

const toggle_lyrics_plugin = <Setting>{
  title: "Enable plugin",
  type: SettingType.binary,
  state: () => useSettings().use_lyrics_plugin,
  action: () => useSettings().toggleLyricsPlugin(),
};

const auto_download_lyrics = <Setting>{
  title: "Auto download lyrics",
  desc: "Automatically download missing lyrics when you are on the lyrics page",
  type: SettingType.binary,
  state: () => useSettings().lyrics_plugin_settings.auto_download,
  action: () => useSettings().toggleLyricsAutoDownload(),
};

export default [toggle_lyrics_plugin, auto_download_lyrics];
