import { defineStore } from "pinia";
import queue from "./queue";

import { LyricsLine } from "@/interfaces";
import { getLyrics, checkExists } from "@/requests/lyrics";
import useTabs from "./tabs";

export default defineStore("lyrics", {
  state: () => ({
    lyrics: <LyricsLine[]>[],
    currentLine: -1,
    ticking: false,
    currentTrack: "",
    exists: false,
    synced: true,
    copyright: "",
  }),
  actions: {
    async getLyrics(filepath: string, trackhash: string, force = false) {
      if (!force && this.currentTrack === trackhash) {
        this.sync();
        return;
      }

      this.currentLine = -1;
      this.copyright = "";
      this.synced = true;

      getLyrics(filepath, trackhash).then((data) => {
        try {
          this.synced = data.synced;
          this.lyrics = data.lyrics;
          this.copyright = data.copyright;
          this.exists = true;
        } catch {
          this.synced = false;
          this.lyrics = <LyricsLine[]>[];
          this.copyright = "";
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
      const tabs = useTabs();

      if (tabs.nowplaying !== tabs.tabs.lyrics) {
        this.lyrics = <LyricsLine[]>[];
      }

      checkExists(filepath, trackhash).then((data) => {
        this.exists = data.exists;
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
    setCurrentLine(line: number, scroll = true) {
      this.currentLine = line;
      this.ticking = false;

      if (!scroll) return;
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
          block: "center",
          inline: "start",
        });
      }
    },
    scrollToContainerTop() {
      const elem = document.getElementById("sidelyrics");

      if (elem) {
        elem.scroll({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    calculateCurrentLine(time: number) {
      if (!this.synced || !this.lyrics) return -1;

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
