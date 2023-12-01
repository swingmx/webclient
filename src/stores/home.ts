import { ref } from "vue";
import { defineStore } from "pinia";

import { getRecentlyAdded } from "@/requests/home";
import { maxAbumCards } from "./content-width";

export default defineStore("homepage", () => {
  const recentlyAdded = ref(<{ type: string; item: any }[]>[]);
  const recentlyAddedCutoff = ref(0);

  function fetchRecentlyAdded() {
    return getRecentlyAdded(maxAbumCards.value).then((data) => {
      recentlyAdded.value = data.items;
      recentlyAddedCutoff.value = data.cutoff;
    });
  }

  return {
    recentlyAdded,
    recentlyAddedCutoff,
    fetchRecentlyAdded,
  };
});
