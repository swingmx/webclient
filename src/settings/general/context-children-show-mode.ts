import { Setting } from "@/interfaces/settings";
import { SettingType } from "@/settings/enums";
import { contextChildrenShowModeStrings as showModeStr } from "./../strings";

import { contextChildrenShowMode as mode } from "@/enums";
import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const context_children_show_mode: Setting = {
  title: showModeStr.settings.show_mode,
  type: SettingType.select,
  options: [
    {
      title: mode.click,
      value: mode.click,
    },
    {
      title: mode.hover,
      value: mode.hover,
    },
  ],
  state: () => settings().contextChildrenShowMode,
  action: (value: mode) => settings().setContextChildrenShowMode(value),
  defaultAction: () => settings().toggleContextChildrenShowMode(),
};

export default [context_children_show_mode];
