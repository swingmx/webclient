import { defineStore } from "pinia";

import useLyrics from "@/stores/lyrics";
import useQueue from "@/stores/queue";

import { findLyrics } from "@/requests/plugins/lyrics";

export default defineStore("lyricsplugin", {
  state: () => ({
    loading: false,
    error: "",
    enabled: false,
  }),
  actions: {
    searchLyrics() {
      this.loading = true;

      const queue = useQueue();
      const lyrics = useLyrics();

      const track = queue.currenttrack;
      const track_title = track.artists.map((artist) => artist.name).join(", ");

      findLyrics(track.title, track_title, track.filepath, track.album)
        .then((data) => {
          if (data && data.downloaded) {
            return lyrics.getLyrics(true);
          }

          throw new Error("No lyrics found!");
        })
        .then(() => {
          this.loading = false;
          setTimeout(() => {
            lyrics.scrollToCurrentLine();
          }, 400);
        })
        .catch((error) => {
          this.loading = false;
          this.error = error.message;

          setTimeout(() => {
            this.error = "";
          }, 5000);
        });
    },
  },
});
