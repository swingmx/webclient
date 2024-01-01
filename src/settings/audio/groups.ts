import { Setting } from "@/interfaces/settings";
import settings from "@/stores/settings";
import { SettingType } from "../enums";

const use_silence: Setting = {
  title: "Silence padding removal",
  desc: "Automatically skip silence between tracks.",
  type: SettingType.binary,
  state: () => settings().use_silence_skip,
  action: () => settings().toggleGapless(),
};

const crossfade: Setting = {
  title: "Crossfade duration",
  desc: "Fade out the current track while fading in the next track.",
  type: SettingType.locked_number_input,
  state: () => settings().crossfade_duration_seconds,
  action: settings().setCrossfadeDuration,
  defaultAction: () => {},
  experimental: true,
};

export default [use_silence, crossfade];
