import { ComputedRef } from "vue";
import { defineStore } from "pinia";

import { useFuse } from "@/utils";

import { FuseTrackOptions } from "@/enums";
import { Folder, FuseResult, Track } from "@/interfaces";
import { getFiles } from "@/requests/folders";

export default defineStore("FolderDirs&Tracks", {
  state: () => ({
    query: "",
    path: <string>{},
    allDirs: <Folder[]>[],
    allTracks: <Track[]>[],
  }),
  actions: {
    async fetchAll(path: string) {
      const { tracks, folders } = await getFiles(path);

      [this.path, this.allDirs, this.allTracks] = [path, folders, tracks];
    },
    resetQuery() {
      this.query = "";
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
