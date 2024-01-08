import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const use_sidebar: Setting = {
  title: "Toggle right sidebar",
  desc: "CTRL + B",
  type: SettingType.binary,
  state: () => settings().use_sidebar,
  action: () => settings().toggleDisableSidebar(),
};

export default [use_sidebar];
