import { defineStore } from "pinia";
import { LyricsLine } from "@/interfaces";
import getLyrics from "@/requests/lyrics";
import queue from "./queue";

export default defineStore("lyrics", {
  state: () => ({
    lyrics: <LyricsLine[]>[],
    currentLine: -1,
    ticking: false,
  }),
  actions: {
    getLyrics(filepath: string) {
      getLyrics(filepath).then((data) => {
        this.lyrics = data.lyrics;
        this.currentLine = -1;

        setTimeout(() => {
          this.scrollToCurrentLine(
            this.currentLine === -1 ? 0 : this.currentLine
          );
        }, 500);
      });
    },
    setNextLineTimer(duration: number) {
      this.ticking = true;

      setTimeout(() => {
        if (queue().playing) {
          this.currentLine++;
          this.ticking = false;
          this.scrollToCurrentLine();
        }
      }, duration - 400);
    },
    setCurrentLine(line: number) {
      this.currentLine = line;
    },
    scrollToCurrentLine(line: number = -1) {
      let lineToScroll = this.currentLine;

      if (line >= 0) {
        lineToScroll = line;
      }

      const elem = document.getElementById(`lyricsline-${lineToScroll}`);

      if (elem) {
        elem.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    },
  },
  getters: {
    nextLineTime(): number {
      if (this.lyrics.length > this.currentLine + 1) {
        return this.lyrics[this.currentLine + 1].time;
      }

      return 0;
    },
  },
});
