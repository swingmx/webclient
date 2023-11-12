import { defineStore } from "pinia";

import useLyrics from "@/stores/lyrics";
import useQueue from "@/stores/queue";

import { findLyrics } from "@/requests/plugins/lyrics";

class TrackChangedError extends Error {
  constructor() {
    super("Track changed!");
    this.name = "TrackChanged";
  }
}

export default defineStore("lyricsplugin", {
  state: () => ({
    loading: false,
    error: "",
  }),
  actions: {
    searchLyrics() {
      this.loading = true;

      const queue = useQueue();
      const lyrics = useLyrics();

      const track = queue.currenttrack;
      const track_title = track.artists.map((artist) => artist.name).join(", ");

      findLyrics(
        track.title,
        track_title,
        track.filepath,
        track.album,
        track.trackhash
      )
        .then((data) => {
          if (data && data.trackhash !== queue.currenttrackhash) {
            throw new TrackChangedError();
          }
          if (data && data.lyrics) {
            return lyrics.setLyrics(data.lyrics);
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
          if (error instanceof TrackChangedError) {
            return;
          }

          this.loading = false;
          this.error = error.message;

          setTimeout(() => {
            this.error = "";
          }, 5000);
        });
    },
  },
});
