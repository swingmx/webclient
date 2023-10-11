import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";
import { appWidthStrings } from "./../strings";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const extend_to_full_width: Setting = {
  title: appWidthStrings.settings.extend,
  desc: "Extend app to use all available screen width",
  type: SettingType.binary,
  state: () => settings().extend_width,
  action: () => settings().toggleExtendWidth(),
  inactive: () => !settings().can_extend_width,
  show_if: () => settings().can_extend_width,
};

export default [extend_to_full_width];
