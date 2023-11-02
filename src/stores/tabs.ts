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
    nowplaying: tablist.thumbnail,
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
    npSwitchToLyrics() {
      this.nowplaying = tablist.lyrics;
    },
    npSwitchToThumbnail() {
      this.nowplaying = tablist.thumbnail;
    },
  },
});
