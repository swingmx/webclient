import { defineStore } from "pinia";
import { LyricsLine } from "@/interfaces";
import getLyrics from "@/requests/lyrics";
import queue from "./queue";

export default defineStore("lyrics", {
  state: () => ({
    lyrics: <LyricsLine[]>[],
    currentLine: -1,
    ticking: false,
    currentTrack: "",
  }),
  actions: {
    getLyrics(filepath: string, trackhash: string) {
      if (this.currentTrack === trackhash) {
        return;
      }

      getLyrics(filepath, trackhash).then((data) => {
        try {
          this.lyrics = data.lyrics;
        } catch {
          this.lyrics = <LyricsLine[]>[];
        }

        this.currentTrack = trackhash;
        this.sync();
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
      }, duration - 250);
    },
    setCurrentLine(line: number) {
      this.currentLine = line;
      this.scrollToCurrentLine();
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
    calculateCurrentLine(time: number) {
      if (!this.lyrics) return -1;
      const millis = time * 1000;

      const closest = this.lyrics.reduce((prev, curr) => {
        return Math.abs(curr.time - millis) < Math.abs(prev.time - millis)
          ? curr
          : prev;
      });

      return this.lyrics.indexOf(closest);
    },
    sync() {
      const line = this.calculateCurrentLine(queue().duration.current);
      this.setCurrentLine(line);
    },
  },
  getters: {
    nextLineTime(): number {
      if (!this.lyrics) return 0;
      if (this.lyrics.length > this.currentLine + 1) {
        return this.lyrics[this.currentLine + 1].time;
      }

      return 0;
    },
  },
});
