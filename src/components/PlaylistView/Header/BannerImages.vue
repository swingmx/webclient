<template>
  <div class="playlist-banner-images" v-if="!playlist.info.has_image">
    <img
      v-for="(img, index) in swapElements(playlist.info.images)"
      :key="index"
      :src="paths.images.thumb.large + img.image"
      class="rounded-sm"
      :style="{
        boxShadow: boxShadow,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import usePStore from "@/stores/pages/playlist";
import { getShift } from "@/utils/colortools/shift";
import { paths } from "@/config";
import { computed } from "vue";

const playlist = usePStore();

const boxShadow = computed(() => {
  if (playlist.info.images.length > 2) {
    return `0 0 1rem ${getShift(playlist.info.images[2].color, [40, 60])}`;
  }

  return "";
});

function swapElements(items: any[]) {
  if (!items.length) return [];
  // swap 2nd and last element by destructuring
  return [items[0], items[3], items[2], items[1]];
}
</script>

<style lang="scss">
.playlist-banner-images {
  width: 15rem;
  position: absolute;
  right: 0rem;
  top: 1rem;
  top: -4rem;
  rotate: -30deg;

  display: grid;
  grid: repeat(2, 1fr) / repeat(2, 1fr);
  gap: $medium;
  transition: all 0.2s ease-in-out;

  img {
    height: 7rem;
    transition: all 0.2s ease-in-out;
  }
  @include smallPhone {
    right: -4rem;

    img {
      height: 7rem;
    }
  }
}
</style>
