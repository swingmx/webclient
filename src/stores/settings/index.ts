import { defineStore } from "pinia";

import { xxl } from "@/composables/useBreakpoints";
import { contextChildrenShowMode } from "@/enums";
import { setMute, setVolume } from "@/player";

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
    show_master_quality_flag: true,
    volume: 1.0,
    mute: false,
  }),
  actions: {
    toggleUseNPImg() {
      this.use_np_img = !this.use_np_img;
    },
    toggleDisableSidebar() {
      this.use_sidebar = !this.use_sidebar;
    },
    toggleExtendWidth() {
      this.extend_width = !this.extend_width;
    },
    setContextChildrenShowMode(mode: contextChildrenShowMode) {
      this.contextChildrenShowMode = mode;
    },
    toggleContextChildrenShowMode() {
      this.contextChildrenShowMode =
        this.contextChildrenShowMode === contextChildrenShowMode.click
          ? contextChildrenShowMode.hover
          : contextChildrenShowMode.click;
    },
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
    toggleRootDirSet() {
      this.root_dir_set = !this.root_dir_set;
    },
    setRootDirs(dirs: string[]) {
      this.root_dirs = dirs;
    },
    toggleFolderListMode() {
      this.folder_list_mode = !this.folder_list_mode;
    },
    toggleShowMasterQualityFlag() {
      this.show_master_quality_flag = !this.show_master_quality_flag;
    },
    // volume
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
