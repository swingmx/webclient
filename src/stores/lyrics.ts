import { defineStore } from "pinia";
import queue from "./queue";

import { LyricsLine } from "@/interfaces";
import { getLyrics, checkExists } from "@/requests/lyrics";

export default defineStore("lyrics", {
  state: () => ({
    lyrics: <LyricsLine[]>[],
    currentLine: -1,
    ticking: false,
    currentTrack: "",
    exists: false,
  }),
  actions: {
    getLyrics(filepath: string, trackhash: string) {
      if (this.currentTrack === trackhash) {
        this.sync();
        return;
      }

      this.currentLine = -1;
      getLyrics(filepath, trackhash).then((data) => {
        try {
          this.lyrics = data.lyrics;
        } catch {
          this.lyrics = <LyricsLine[]>[];
        }

        this.currentTrack = trackhash;
        if (this.currentLine == -1) {
          setTimeout(() => {
            this.scrollToContainerTop();
          }, 400);
          return;
        }

        this.sync();
      });
    },
    checkExists(filepath: string, trackhash: string) {
      checkExists(filepath, trackhash).then((data) => {
        this.exists = data.filepath !== null;
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
      }, duration - 300);
    },
    setCurrentLine(line: number) {
      this.currentLine = line;

      setTimeout(() => {
        this.scrollToCurrentLine();
      }, 400);
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
          block: "end",
          inline: "start",
        });
      }
    },
    scrollToContainerTop() {
      const elem = document.getElementById("sidelyrics");

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

      return this.lyrics.indexOf(closest) - 1;
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
