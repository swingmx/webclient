<template>
  <RouterLink
    :to="{
      name: Routes.nowPlaying,
      params: { tab },
      replace: true,
    }"
  >
    <button class="lyrics" :class="{ showStatus: lyrics.exists }">
      <LyricsSvg /> {{ showText ? "Lyrics" : "" }} 
    </button>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { Routes } from "@/router";
import useLyrics from "@/stores/lyrics";
import LyricsSvg from "@/assets/icons/lyrics.svg";

defineProps<{
  showText?: boolean;
}>();
const route = useRoute();
const lyrics = useLyrics();

const tab = computed(() => {
  if (route.params.tab == "lyrics") {
    return "home";
  }

  return "lyrics";
});
</script>
