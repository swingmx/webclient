<template>
  <div v-if="queue.currenttrack" class="lyricsinfo" :style="{ background: bgColor }">
    <RouterLink
      :to="{
        name: Routes.album,
        params: {
          albumhash: queue.currenttrack.albumhash,
        },
      }"
    >
      <img :src="paths.images.thumb.small + queue.currenttrack.image" class="shadow-sm" />
    </RouterLink>

    <div class="text">
      <div class="title ellip">{{ queue.currenttrack.title }}</div>
      <ArtistName :artists="queue.currenttrack.artists" :albumartists="queue.currenttrack.albumartists" />
    </div>
    <div class="right">
      <div v-if="lyrics.lyrics.length && !lyrics.synced" class="lyricstype">unsynced</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useLyrics from "@/stores/lyrics";
import useQueue from "@/stores/queue";

import ArtistName from "@/components/shared/ArtistName.vue";
import { paths } from "@/config";
import { Routes } from "@/router";

const queue = useQueue();
const lyrics = useLyrics();

defineProps<{
  bgColor: string;
}>();
</script>

<style lang="scss">
.lyricsinfo {
  padding: 2rem 0 1rem 0;
  font-size: 1rem;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: $medium;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;

  @include allPhones {
    padding: $large 0;
    margin-bottom: -$small;
  }

  img {
    display: block;
    height: 2.5rem;
    border-radius: $smaller;
  }

  .title {
    font-size: 0.85rem;
  }

  .artist {
    font-size: 0.8rem;
  }

  .lyricstype {
    border-radius: $smaller;
    font-size: 12px;
    padding: $smaller $small;
    background-color: $white;
    color: $black;
  }
}
</style>
