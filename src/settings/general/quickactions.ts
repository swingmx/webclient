import { Setting } from "@/interfaces/settings";
import { SettingType } from "../enums";

const quick_settings: Setting = {
  title: "Quick settings",
  type: SettingType.quick_actions,
  state: () => {},
  action: () => {},
};

export default [quick_settings];
