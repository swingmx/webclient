<template>
  <button
    class="lyrics"
    :class="{ showStatus: lyrics.exists }"
    @click="handleClick"
  >
    <LyricsSvg /> {{ showText ? "Lyrics" : "" }}
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Routes } from "@/router";
import useLyrics from "@/stores/lyrics";
import LyricsSvg from "@/assets/icons/lyrics.svg";

defineProps<{
  showText?: boolean;
}>();

const route = useRoute();
const router = useRouter();

const lyrics = useLyrics();
let prevRoute = ref(route.name);

function handleClick() {
  if (route.name === Routes.nowPlaying && route.params.tab === "lyrics") {
    return router.back();
  }

  router.push({
    name: Routes.nowPlaying,
    params: { tab: "lyrics" },
  });

  prevRoute.value = route.name;
}
</script>
