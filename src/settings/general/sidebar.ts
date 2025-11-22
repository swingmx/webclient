import { getT } from "@/i18n";
import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const { t } = getT();

const use_sidebar: Setting = {
  title: t("Settings.General.Sidebar.Title"),
  desc: t("Settings.General.Sidebar.Description"),
  type: SettingType.binary,
  state: () => settings().use_sidebar,
  action: () => settings().toggleDisableSidebar(),
  show_if: () => !settings().is_alt_layout,
};

export default [use_sidebar];
