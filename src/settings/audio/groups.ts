import { Setting } from "@/interfaces/settings";
import settings from "@/stores/settings";
import { SettingType } from "../enums";

const use_silence: Setting = {
  title: "Silence padding removal",
  desc: "Automatically skip silence between tracks.",
  type: SettingType.binary,
  state: () => settings().use_silence_skip,
  action: () => settings().toggleUseSilenceSkip(),
};

const use_crossfade: Setting = {
  title: "Enable crossfade",
  desc: "Fade out the current track while fading in the next track",
  type: SettingType.binary,
  state: () => settings().use_crossfade,
  action: () => settings().toggleCrossfade(),
  // @ts-ignore
  experimental: !(window.chrome),
};

const crossfade: Setting = {
  title: "Crossfade duration",
  desc: "Duration of the crossfade in seconds",
  type: SettingType.locked_number_input,
  state: () => settings().crossfade_duration_seconds,
  action: settings().setCrossfadeDuration,
  defaultAction: () => {},
  show_if: () => settings().use_crossfade,
};

export default [use_silence, use_crossfade, crossfade];
