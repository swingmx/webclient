<template>
  <div class="card-list-scroll-x">
    <h3>
      {{ title }} <SeeAll v-if="route" :route="route" />
    </h3>
    <div class="cards">
      <ArtistCard
        v-for="artist in artists.slice(0, maxAbumCards)"
        :key="artist.image"
        class="hlistitem"
        :artist="artist"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Artist } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";

import ArtistCard from "@/components/shared/ArtistCard.vue";
import SeeAll from "../shared/SeeAll.vue";

defineProps<{
  artists: Artist[];
  title: string;
  route?: string;
}>();
</script>
