<template>
  <div
    class="recent-items"
    :style="{
      height: `${heightCalculator(height)}px`,
    }"
  >
    <h3>Recent</h3>
    <div ref="recentitemswrappers" class="list">
      <Recentsitemcard
        v-for="fav in favs.slice(0, maxAbumCards)"
        :key="JSON.stringify(fav)"
        :fav="fav"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";

import { RecentFavResult } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";
import heightCalculator from "@/utils/heightCalculator";

import Recentsitemcard from "@/components/Favorites/RecentsItemCard.vue";

defineProps<{
  favs: RecentFavResult[];
}>();

const recentitemswrappers = ref<HTMLElement | null>(null);
const { height } = useElementSize(recentitemswrappers);
</script>

<style lang="scss">
.recent-items {
  overflow: hidden;
  margin-bottom: 2rem;
  margin-top: 1rem;

  h3 {
    padding: 0 0.75rem;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 5rem 0;
  }
}
</style>
