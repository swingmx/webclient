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
