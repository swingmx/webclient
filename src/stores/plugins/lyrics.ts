import { defineStore } from "pinia";

import useQueue from "@/stores/queue";
import useLyrics from "@/stores/lyrics";

import findLyrics from "@/requests/plugins/lyrics";

export default defineStore("lyricsplugin", {
  state: () => ({
    all_versions: [],
    current_version: "",
    loading: false,
    error: "",
    enabled: false,
  }),
  actions: {
    searchLyrics() {
      const queue = useQueue();
      const lyrics = useLyrics();
      const track = queue.currenttrack;

      findLyrics(
        track.title,
        track.artists.map((artist) => artist.name).join(", "),
        track.filepath,
        track.album
      ).then((data) => {
        if (data && data.all) {
          this.all_versions = data.all;
          this.current_version = data.all[0];
        }

        if (data && data.downloaded) {
          lyrics.getLyrics(track.filepath, track.trackhash, true).then(() => {
            this.loading = false;
          });
          return;
        }

        this.loading = false;
        this.error = "No lyrics found!";

        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
    },
  },
});
