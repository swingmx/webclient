import { Setting } from "@/interfaces/settings";
import { SettingType } from "../enums";

import useSettingsStore from "@/stores/settings";
import { setSetting } from "@/requests/settings";
import { DbSettingKeys } from "@/enums";

export default <Setting>{
  title: "Enter separators separated by a comma",
  desc: `These will be used to separate artists and album artists`,
  state: () => {
    const store = useSettingsStore();

    const root_dirs_set = store.root_dirs.length > 0;

    if (root_dirs_set) {
      return store.separators;
    }

    return [];
  },
  action: async (payload: string) => {
    if (!payload) return;

    const { result } = await setSetting(
      DbSettingKeys.artist_separators,
      payload
    );

    if (result) {
      useSettingsStore().setArtistSeparators(payload.split(","));
    }

    return true;
  },
  type: SettingType.separators_input,
};
