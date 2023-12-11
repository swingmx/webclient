import { ref } from "vue";
import { defineStore } from "pinia";

import { getRecentlyAdded, getRecentlyPlayed } from "@/requests/home";
import { maxAbumCards } from "./content-width";
import { Routes, router } from "@/router";

export default defineStore("homepage", () => {
  const recentlyAddedCutoff = ref(0);
  type itemlist = { type: string; item: any }[];

  const recentlyAdded = ref(<itemlist>[]);
  const recentlyPlayed = ref(<itemlist>[]);

  async function fetchRecentlyAdded() {
    const data = await getRecentlyAdded(maxAbumCards.value);
    recentlyAdded.value = data.items;
    recentlyAddedCutoff.value = data.cutoff;
  }

  async function fetchRecentlyPlayed() {
    const data = await getRecentlyPlayed(maxAbumCards.value);
    recentlyPlayed.value = data.items;
  }

  function resetAll() {
    setTimeout(() => {
      if (router.currentRoute.value.name == Routes.Home) return;
      [recentlyAdded.value, recentlyPlayed.value] = [[], []];
    }, 5000);
  }

  return {
    recentlyAddedCutoff,
    recentlyAdded,
    recentlyPlayed,
    fetchRecentlyAdded,
    fetchRecentlyPlayed,
    resetAll,
  };
});
