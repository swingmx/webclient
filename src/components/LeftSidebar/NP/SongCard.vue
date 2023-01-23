<template>
  <Presence>
    <Motion
      :key="q.currenttrack?.filepath"
      :initial="{ opacity: 0, x: q.to }"
      :animate="{
        opacity: 1,
        x: 0,
        transition: { delay: 0.1, duration: 0.25, easing: 'ease-out' },
      }"
      :exit="{ opacity: 0, x: -50 }"
    >
      <div class="sidebar-songcard">
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
            class="l-image rounded force-lm"
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
  </Presence>
</template>

<script setup lang="ts">
import useQueueStore from "@/stores/queue";

import { paths } from "@/config";
// import { Track } from "@/interfaces";

// defineProps<{
//   track: Track | undefined;
// }>();

const imguri = paths.images.thumb.large;
const q = useQueueStore();
</script>

<style lang="scss">
.sidebar-songcard {
  width: 100%;
  position: relative;

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
