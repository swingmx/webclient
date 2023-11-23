import { defineStore } from "pinia";

export default defineStore("playTracker", {
  state: () => ({
    track: {
      trackhash: "",
      duration: 0,
    },
  }),
  actions: {
    
  },
});
