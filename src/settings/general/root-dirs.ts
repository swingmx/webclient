import { SettingType } from "../enums";
import { Setting } from "@/interfaces/settings";
import { manageRootDirsStrings as data } from "../strings";
import { addRootDirs as editRootDirs } from "@/composables/fetch/settings/rootdirs";

import useModalStore from "@/stores/modal";
import useSettingsStore from "@/stores/settings";

const text = data.settings;

const change_root_dirs: Setting = {
  title: text.change,
  type: SettingType.button,
  state: null,
  button_text: () =>
    `\xa0 \xa0 ${
      useSettingsStore().root_dirs.length ? "Modify" : "Configure"
    } \xa0 \xa0`,
  action: () => useModalStore().showRootDirsPromptModal(),
};

const list_root_dirs: Setting = {
  title: text.list_root_dirs,
  type: SettingType.list,
  state: () =>
    useSettingsStore().root_dirs.map((d) => ({
      title: d,
      buttontext: "remove",
      action: () => {
        editRootDirs([], [d]).then((all_dirs) => {
          useSettingsStore().setRootDirs(all_dirs);
        });
      },
    })),
  action: () => {},
};

export default [change_root_dirs, list_root_dirs];
