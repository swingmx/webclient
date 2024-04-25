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

export default [disable_np_img];
