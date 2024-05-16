import { ComputedRef } from "vue";
import { defineStore } from "pinia";

import { useFuse } from "@/utils";

import { FuseTrackOptions } from "@/enums";
import { Folder, FuseResult, Track } from "@/interfaces";
import { getFiles } from "@/requests/folders";
import { Routes, router } from "@/router";

export default defineStore("FolderDirs&Tracks", {
  state: () => ({
    query: "",
    path: <string>{},
    allDirs: <Folder[]>[],
    allTracks: <Track[]>[],
  }),
  actions: {
    async fetchAll(fpath: string) {
      this.path = fpath;
      const { tracks, folders, path } = await getFiles(fpath);

      if (path !== fpath){
        fpath = path;
      }

      [this.path, this.allDirs, this.allTracks] = [fpath, folders, tracks];
    },
    resetQuery() {
      this.query = "";
    },
    resetAll() {
      setTimeout(() => {
        if (router.currentRoute.value.name == Routes.folder) return;

        [this.allDirs, this.allTracks] = [[], []];
        this.resetQuery();
      }, 5000);
    },
  },
  getters: {
    filteredTracks(): ComputedRef<FuseResult[]> {
      return useFuse(this.query, this.allTracks, FuseTrackOptions);
    },
    tracks(): Track[] {
      const tracks = this.filteredTracks.value.map((result: FuseResult) => {
        const t = {
          ...result.item,
          index: result.refIndex,
        };

        return t;
      });

      return tracks;
    },
    dirs(): Folder[] {
      const dirs = useFuse(this.query, this.allDirs, {
        keys: ["name"],
      });

      return dirs.value.map((result) => {
        return result.item;
      });
    },
  },
});
