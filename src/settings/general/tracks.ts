import { DbSettingKeys as setting } from "@/enums";
import { Setting } from "@/interfaces/settings";
import { SettingType } from "../enums";

import { setSetting } from "@/requests/settings";
import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const process_featured_artists: Setting = {
  title: "Featured artists",
  desc: "Remove featured artists from titles and merge them with other artists",
  type: SettingType.binary,
  state: () => settings().feat,
  action: () => {
    const settings = useSettingsStore();
    setSetting(setting.extract_feat, !settings.feat).then(({ status }) => {
      status === 200 && settings.toggleProcessFeaturedArtists();
    });
  },
};

const remove_prod_by: Setting = {
  title: "Hide 'prod.'",
  desc: "Remove 'prod.' from track titles",
  type: SettingType.binary,
  state: () => settings().prodby,
  action: () => {
    const settings = useSettingsStore();
    setSetting(setting.remove_prod, !settings.prodby).then(({ status }) => {
      status === 200 && settings.toggleRemoveProdBy();
    });
  },
};

const remove_remaster_info_from_titles: Setting = {
  title: "Hide remaster info",
  desc: "Remove remaster information from track titles if possible",
  type: SettingType.binary,
  state: () => settings().hide_remaster,
  action: () => {
    const settings = useSettingsStore();
    setSetting(setting.remove_remaster, !settings.hide_remaster).then(
      ({ status }) => {
        status === 200 && settings.toggleRemoveRemasterInfoFromTitles();
      }
    );
  },
};

export default [
  process_featured_artists,
  remove_remaster_info_from_titles,
  remove_prod_by,
];
