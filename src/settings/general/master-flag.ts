import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";
import { showMasterFlag } from "./../strings";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const show_master_flag: Setting = {
  title: showMasterFlag.settings.show_flag,
  type: SettingType.binary,
  state: () => settings().show_master_quality_flag,
  action: () => settings().toggleShowMasterQualityFlag(),
};

export default [show_master_flag];
