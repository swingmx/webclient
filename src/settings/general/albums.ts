import { DbSettingKeys as setting } from "@/enums";
import { Setting } from "@/interfaces/settings";
import { SettingType } from "../enums";

import { setSetting } from "@/requests/settings";
import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore;

const clean_album_titles: Setting = {
  title: "Clean album titles",
  desc: "Remove bracketed text from titles and process it separately if possible",
  type: SettingType.binary,
  state: () => settings().clean_titles,
  action: () => {
    const settings = useSettingsStore();
    setSetting(setting.clean_album_title, !settings.clean_titles).then(
      ({ status }) => {
        status === 200 && settings.toggleCleanTrackTitles();
      }
    );
  },
};

const merge_album_versions: Setting = {
  title: "Merge album versions",
  desc: "All versions of the same album will be merged into one album",
  type: SettingType.binary,
  state: () => {
    const settings = useSettingsStore();
    return settings.clean_titles && settings.merge_albums;
  },
  action: () => {
    const settings = useSettingsStore();
    setSetting(setting.merge_albums, !settings.merge_albums).then(
      ({ status }) => {
        status === 200 && settings.toggleMergeAlbumVersions();
      }
    );
  },
  inactive: () => !settings().clean_titles,
};

const show_albums_as_singles: Setting = {
  title: "Mark albums with one track as singles",
  desc: "Require an album to have at least two tracks",
  type: SettingType.binary,
  state: () => useSettingsStore().show_albums_as_singles,
  action: () => {
    const settings = useSettingsStore();
    setSetting(
      setting.show_albums_as_singles,
      !settings.show_albums_as_singles
    ).then(({ status }) => {
      status === 200 && settings.toggleShowAlbumAsSingle();
    });
  },
};

export default [
  clean_album_titles,
  merge_album_versions,
  show_albums_as_singles,
];
