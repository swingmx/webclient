import { defineStore } from "pinia";

import { contextChildrenShowMode } from "@/composables/enums";
import { xxl } from "@/composables/useBreakpoints";

export default defineStore("settings", {
  state: () => ({
    use_np_img: true,
    use_sidebar: true,
    extend_width: false,
    contextChildrenShowMode: contextChildrenShowMode.click,
    artist_top_tracks_count: 5,
    repeat_all: true,
    repeat_one: false,
    root_dir_set: false,
    root_dirs: <string[]>[],
    folder_list_mode: false,
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
