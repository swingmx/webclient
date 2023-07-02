<template>
  <Motion
    :key="q.currenttrack?.filepath"
    :initial="{ opacity: 0, scale: 0.9 }"
    :animate="{
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'ease-in' },
    }"
    :exit="{ opacity: 0, scale: 0.9 }"
  >
    <div class="sidebar-songcard rounded-sm" v-wave>
      <router-link
        :to="{
          name: 'AlbumView',
          params: {
            hash: q.currenttrack?.albumhash ? q.currenttrack.albumhash : ' ',
          },
        }"
      >
        <img
          :src="imguri + q.currenttrack?.image"
          alt=""
          class="l-image rounded-sm force-lm"
        />
      </router-link>
      <div
        id="bitrate"
        v-if="q.currenttrack?.bitrate"
        title="file type • bitrate"
      >
        {{ q.currenttrack.filetype }} • {{ q.currenttrack.bitrate }}
      </div>
    </div>
  </Motion>
</template>

<script setup lang="ts">
import useQueueStore from "@/stores/queue";

import { paths } from "@/config";

const imguri = paths.images.thumb.large;
const q = useQueueStore();
</script>

<style lang="scss">
.sidebar-songcard {
  width: 100%;
  position: relative;
  width: 13rem;
  height: 13rem;

  img {
    cursor: pointer;
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: cover;
  }

  #bitrate {
    position: absolute;
    font-size: 0.75rem;
    width: max-content;
    padding: 0.2rem 0.35rem;
    bottom: $medium;
    left: $small;
    background-color: $gray4;
    border-radius: $smaller;
    text-transform: uppercase;
  }
}
</style>
