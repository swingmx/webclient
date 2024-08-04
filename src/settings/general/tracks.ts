import { Setting } from "@/interfaces/settings";
import { SettingType } from "../enums";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const process_featured_artists: Setting = {
  title: "Featured artists",
  desc: "Remove featured artists from titles and merge them with other artists",
  type: SettingType.binary,
  state: () => settings().feat,
  action: () => settings().toggleExtractFeaturedArtists(),
};

const remove_prod_by: Setting = {
  title: "Hide 'prod.'",
  desc: "Remove 'prod.' from track titles",
  type: SettingType.binary,
  state: () => settings().prodby,
  action: () => settings().toggleRemoveProdBy(),
};

const remove_remaster_info_from_titles: Setting = {
  title: "Hide remaster info",
  desc: "Remove remaster information from track titles if possible",
  type: SettingType.binary,
  state: () => settings().hide_remaster,
  action: () => settings().toggleRemoveRemasterInfo(),
};

export default [
  process_featured_artists,
  remove_remaster_info_from_titles,
  remove_prod_by,
];
