<template>
  <button
    class="pluginfindlyricsbtn circular"
    @click="!error ? findOnline() : null"
  >
    {{ error ? error : "Find on the internet" }}
    <span v-if="loading" class="spinner"></span>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";

import useQueue from "@/stores/queue";
import findLyrics from "@/requests/plugins/lyrics";
import useLyrics from "@/stores/lyrics";

const queue = useQueue();
const lyrics = useLyrics();

const loading = ref(false);
const error = ref("");

function findOnline() {
  const track = queue.currenttrack;
  loading.value = true;

  findLyrics(
    track.title,
    track.artists.map((artist) => artist.name).join(", "),
    track.filepath,
    track.album
  ).then((data) => {
    if (data && data.downloaded) {
      lyrics.getLyrics(track.filepath, track.trackhash, true).then(() => {
        loading.value = false;
      });
      return;
    }

    loading.value = false;
    error.value = "No lyrics found!";

    setTimeout(() => {
      error.value = "";
    }, 5000);
  });
}
</script>

<style lang="scss">
.pluginfindlyricsbtn {
  padding: 1.5rem 2rem;
  font-size: 1rem !important;
  background-color: $white;
  color: $black;
  margin-top: 1rem;

  &:hover {
    background-color: $white;
    color: $black;
  }

  .spinner {
    margin-left: $medium;
  }
}
</style>
