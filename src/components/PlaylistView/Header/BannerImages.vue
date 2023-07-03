<template>
  <div class="playlist-banner-images" v-if="!playlist.info.has_image">
    <img
      v-for="(img, index) in playlist.info.images"
      :key="index"
      :src="paths.images.thumb.large + img.image"
      alt=""
      class="rounded-sm"
      :style="{
        boxShadow: `0 0 1rem ${
          !playlist.info.has_image && playlist.info.images.length > 2
            ? getShift(playlist.info.images[2].color, [40, 60])
            : ''
        }`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import usePStore from "@/stores/pages/playlist";
import { getShift } from "@/utils/colortools/shift";
import { paths } from "@/config";

const playlist = usePStore();
</script>

<style lang="scss">
.playlist-banner-images {
  width: 21rem;
  position: absolute;
  right: 0;
  top: -10rem;
  rotate: -40deg;

  display: flex;
  flex-wrap: wrap;
  gap: $medium;
  transition: all 0.2s ease-in-out;

  img {
    height: 9rem;
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
