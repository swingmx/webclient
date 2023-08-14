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
    <div v-wave class="sidebar-songcard rounded-sm">
      <router-link
        :to="{
          name: Routes.nowPlaying,
        }"
      >
        <img
          :src="imguri + q.currenttrack?.image"
          alt=""
          class="l-image rounded-sm force-lm"
        />
      </router-link>
      <Bitrate />
    </div>
  </Motion>
</template>

<script setup lang="ts">
import { Motion } from "motion/vue";
import useQueueStore from "@/stores/queue";

import { paths } from "@/config";
import Bitrate from "./Bitrate.vue";
import { Routes } from "@/router";

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
}
</style>
