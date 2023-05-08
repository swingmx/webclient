<template>
  <div
    class="f-artists"
    :style="{
      height: `${heightCalculator(height)}px`,
    }"
  >
    <h3>{{ title }} <SeeAll :route="route" /></h3>
    <div class="artist-list" ref="artistItemswrappers">
      <ArtistCard
        v-for="artist in artists.slice(0, maxAbumCards)"
        :key="artist.image"
        :artist="artist"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";

import { Artist } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";
import heightCalculator from "@/utils/heightCalculator";

import SeeAll from "../shared/SeeAll.vue";
import ArtistCard from "@/components/shared/ArtistCard.vue";

defineProps<{
  artists: Artist[];
  title: string;
  route: string;
}>();

const artistItemswrappers = ref<HTMLElement | null>(null);
const { height } = useElementSize(artistItemswrappers);
</script>

<style lang="scss">
.f-artists {
  overflow: hidden;

  h3 {
    display: flex;
    justify-content: space-between;
    padding-left: $medium;
    align-items: baseline;
    margin-bottom: $medium;
  }

  .artist-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 5rem 0;
  }
}
</style>
