import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const disable_np_img: Setting = {
  title: "Hide album art from the left sidebar",
  type: SettingType.binary,
  state: () => !settings().use_np_img,
  action: () => settings().toggleUseNPImg(),
  show_if: () => !settings().is_alt_layout,
};

const showNowPlayingOnTabTitle: Setting = {
  title: "Show Now Playing track on tab title",
  desc: "Replace current page info with Now Playing track info",
  type: SettingType.binary,
  state: () => settings().nowPlayingTrackOnTabTitle,
  action: () => settings().toggleNowPlayingTrackOnTabTitle(),
};



export default [disable_np_img, showNowPlayingOnTabTitle];
