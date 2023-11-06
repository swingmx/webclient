<template>
  <div
    v-if="queue.currenttrack"
    class="lyricsinfo"
    :style="{ background: bgColor }"
  >
    <RouterLink
      :to="{
        name: Routes.album,
        params: {
          albumhash: queue.currenttrack.albumhash,
        },
      }"
    >
      <img
        :src="paths.images.thumb.small + queue.currenttrack.image"
        class="shadow-sm"
      />
    </RouterLink>

    <div class="text">
      <div class="title ellip">{{ queue.currenttrack.title }}</div>
      <ArtistName
        :artists="queue.currenttrack.artists"
        :albumartists="queue.currenttrack.albumartists"
      />
    </div>
    <div class="right">
      <div v-if="lyrics.lyrics.length && !lyrics.synced" class="lyricstype">
        unsynced
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useQueue from "@/stores/queue";
import useLyrics from "@/stores/lyrics";

import { paths } from "@/config";
import { Routes } from "@/router";
import ArtistName from "../../shared/ArtistName.vue";

const queue = useQueue();
const lyrics = useLyrics();

defineProps<{
  bgColor: string;
}>();
</script>

<style lang="scss">
.lyricsinfo {
  padding: $medium 1.5rem;
  font-size: 1rem;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: $small;
  align-items: center;
  position: sticky;
  top: -$medium;
  margin: -1.5rem;
  z-index: 1;

  img {
    height: 2.5rem;
    border-radius: $smaller;
  }

  .artist {
    font-size: small;
  }

  .title {
    font-size: 14px;
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
