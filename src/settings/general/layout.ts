import { useT } from "@/i18n";
import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";

import useSettingsStore from "@/stores/settings";

const { t } = useT();

const settings = useSettingsStore;

const use_alt_layout: Setting = {
  title: t("Settings.General.UseNoSidebarTitle"),
  type: SettingType.binary,
  state: () => settings().is_alt_layout,
  action: () => settings().toggleLayout(),
  flag: "new",
};

export default [use_alt_layout];
