import { Setting } from "@/interfaces/settings";
import { SettingType } from "../enums";

const quick_actions: Setting = {
  title: "Quick actions",
  type: SettingType.quick_actions,
  state: () => {},
  action: () => {},
};

export default [quick_actions];
