<template>
  <div
    class="playlist-banner-images no-scroll"
    :style="{
      background: (playlist.info.images[1] as any).color,
    }"
  >
    <img
      v-for="(img, index) in playlist.info.images"
      :key="index"
      :src="paths.images.thumb.medium + (img as any).image"
      class=""
    />
  </div>
</template>

<script setup lang="ts">
import { paths } from "@/config";
import usePStore from "@/stores/pages/playlist";

const playlist = usePStore();
</script>

<style lang="scss">
.playlist-banner-images {
  display: grid;
  grid: repeat(2, 1fr) / repeat(2, 1fr);
  transition: all 0.2s ease-in-out;

  img {
    height: 7rem;
    transition: all 0.2s ease-in-out;
  }

  @include largePhones {
    right: -4rem;

    img {
      height: 7rem;
    }
  }
}
</style>
