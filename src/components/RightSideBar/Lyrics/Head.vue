<template>
  <div v-if="queue.currenttrack" class="lyricsinfo" :style="{ background: colors.theme2 }">
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
  </div>
</template>

<script setup lang="ts">
import { paths } from "@/config";
import ArtistName from "../../shared/ArtistName.vue";
import useQueue from "@/stores/queue";
import { Routes } from "@/router";
import useColors from "@/stores/colors";

const colors = useColors();
const queue = useQueue();
</script>

<style lang="scss">
.lyricsinfo {
    padding: $medium 1.5rem;
  font-size: 1rem;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: $small;
  align-items: flex-end;
  position: sticky;
  top: -$medium;
  margin: -1.5rem;

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
}
</style>
