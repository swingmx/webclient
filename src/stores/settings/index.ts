import { defineStore } from "pinia";

import { xxl } from "@/composables/useBreakpoints";
import { DBSettings, NotifType, contextChildrenShowMode } from "@/enums";
import { setMute, setVolume } from "@/player";
import { useNotifStore } from "../notification";

export default defineStore("settings", {
  state: () => ({
    use_np_img: true,
    use_sidebar: true,
    extend_width: false,
    contextChildrenShowMode: contextChildrenShowMode.hover,
    artist_top_tracks_count: 5,
    repeat_all: true,
    repeat_one: false,
    root_dir_set: false,
    root_dirs: <string[]>[],
    folder_list_mode: false,
    volume: 1.0,
    mute: false,
    hidden_radios_unlocked: false,

    feat: true,
    prodby: true,
    clean_titles: true,
    hide_remaster: true,
    merge_albums: false,
  }),
  actions: {
    mapDbSettings(settings: DBSettings) {
      this.root_dirs = settings.root_dirs;
      this.feat = settings.extract_feat;
      this.prodby = settings.remove_prod;
      this.clean_titles = settings.clean_album_title;
      this.hide_remaster = settings.remove_remaster;
      this.merge_albums = settings.merge_albums;
    },
    // now playing 👇
    toggleUseNPImg() {
      this.use_np_img = !this.use_np_img;
    },
    // sidebar 👇
    toggleDisableSidebar() {
      this.use_sidebar = !this.use_sidebar;
    },
    toggleExtendWidth() {
      this.extend_width = !this.extend_width;
    },
    // context menu 👇
    setContextChildrenShowMode(mode: contextChildrenShowMode) {
      this.contextChildrenShowMode = mode;
    },
    toggleContextChildrenShowMode() {
      this.contextChildrenShowMode =
        this.contextChildrenShowMode === contextChildrenShowMode.click
          ? contextChildrenShowMode.hover
          : contextChildrenShowMode.click;
    },
    // repeat 👇
    toggleRepeatMode() {
      if (this.repeat_all) {
        this.repeat_all = false;
        this.repeat_one = true;
        return;
      }

      if (this.repeat_one) {
        this.repeat_one = false;
        this.repeat_all = false;
        return;
      }

      if (!this.repeat_all && !this.repeat_one) {
        this.repeat_all = true;
      }
    },
    // root dirs 👇
    toggleRootDirSet() {
      this.root_dir_set = !this.root_dir_set;
    },
    setRootDirs(dirs: string[]) {
      this.root_dirs = dirs;
    },
    // folders 👇
    toggleFolderListMode() {
      this.folder_list_mode = !this.folder_list_mode;
    },
    // titles 👇
    toggleProcessFeaturedArtists() {
      this.feat = !this.feat;
    },
    toggleRemoveProdBy() {
      this.prodby = !this.prodby;
    },
    toggleCleanTrackTitles() {
      this.clean_titles = !this.clean_titles;
    },
    toggleRemoveRemasterInfoFromTitles() {
      this.hide_remaster = !this.hide_remaster;
    },
    toggleMergeAlbumVersions() {
      this.merge_albums = !this.merge_albums;
    },
    // volume 👇
    setVolume(new_value: number) {
      setVolume(new_value);
      this.volume = new_value;
    },
    toggleMute() {
      this.mute = !this.mute;
      setMute(this.mute);
    },
    initializeVolume() {
      setVolume(this.volume);
      setMute(this.mute);
    },
    // radios 👇
    isRadioTime() {
      const date = new Date();
      const hour = date.getHours();

      // "... right time"
      return hour >= 19 && hour <= 23;
    },
    unlockHiddenRadios() {
      if (!this.isRadioTime()) return;
      if (!this.hidden_radios_unlocked) {
        useNotifStore().showNotification(
          "Internet Radios Unlocked!",
          NotifType.Success
        );
      }

      this.hidden_radios_unlocked = true;
    },
  },
  getters: {
    can_extend_width(): boolean {
      return xxl.value;
    },
    no_repeat(): boolean {
      return !this.repeat_all && !this.repeat_one;
    },
  },
  persist: {
    afterRestore: (context) => {
      let store = context.store;
      store.root_dirs = [];
      store.root_dir_set = false;
    },
  },
});
