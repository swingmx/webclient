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
  show_if: () => useSettings().use_lyrics_plugin,
};

const auto_download_on_unsynced = <Setting>{
  title: "Overide unsynced lyrics",
  desc: "Automatically download lyrics even if unsynced lyrics are locally available",
  type: SettingType.binary,
  state: () => useSettings().lyrics_plugin_settings.overide_unsynced,
  action: () => useSettings().toggleLyricsOverideUnsynced(),
  show_if: () => {
    const settings = useSettings();
    return settings.use_lyrics_plugin && settings.lyrics_plugin_settings.auto_download;
  },
};

export default [
  toggle_lyrics_plugin,
  auto_download_lyrics,
  auto_download_on_unsynced,
];
