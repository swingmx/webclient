import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";
import { manageRootDirsStrings as data } from "../strings";

import useModalStore from "@/stores/modal";
import useSettingsStore from "@/stores/settings";

const text = data.settings;

const change_root_dirs: Setting = {
  title: text.change,
  type: SettingType.button,
  source: null,
  button_text: `\xa0 \xa0 \xa0 \xa0 Modify \xa0 \xa0 \xa0 \xa0`,
  action: () => useModalStore().showRootDirsPromptModal(),
};

const list_root_dirs: Setting = {
  title: text.list_root_dirs,
  type: SettingType.list,
  source: () => useSettingsStore().root_dirs,
  action: () => {},
};

export default [change_root_dirs, list_root_dirs];
