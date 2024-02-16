import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const use_alt_layout: Setting = {
  title: "Use no sidebar layout",
  type: SettingType.binary,
  state: () => settings().is_alt_layout,
  action: () => settings().toggleLayout(),
  new: true,
};

export default [use_alt_layout];
