import { focusElemByClass } from "@/utils";
import { defineStore } from "pinia";
import lyrics from "./lyrics";

const tablist = {
  home: "home",
  queue: "queue",
  search: "search",
  lyrics: "lyrics",
  thumbnail: "thumbnail",
};

export default defineStore("tabs", {
  state: () => ({
    tabs: tablist,
    current: tablist.queue,
    nowplaying: tablist.lyrics,
  }),
  actions: {
    changeTab(tab: string) {
      if (tab === this.tabs.queue) {
        setTimeout(() => {
          focusElemByClass("currentInQueue");
        }, 500);
      }
      this.current = tab;
    },
    switchToQueue() {
      this.changeTab(tablist.queue);
    },
    switchToSearch() {
      this.changeTab(tablist.search);
    },
    switchToHome() {
      this.changeTab(tablist.home);
    },
    switchToLyrics() {
      this.changeTab(tablist.lyrics);
      setTimeout(() => {
        lyrics().sync();
      }, 500);
    },
    npToggleTab() {
      this.nowplaying =
        this.nowplaying === tablist.thumbnail
          ? tablist.lyrics
          : tablist.thumbnail;
    },
  },
});
