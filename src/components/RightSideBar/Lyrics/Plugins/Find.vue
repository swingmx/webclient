<template>
  <button
    class="pluginfindlyricsbtn circular"
    @click="!plugin.error ? plugin.searchLyrics() : null"
  >
    {{ plugin.error ? plugin.error : "Find on the internet" }}
    <span v-if="plugin.loading" class="spinner"></span>
  </button>
</template>

<script setup lang="ts">
import useLyricsPlugin from "@/stores/plugins/lyrics";

const plugin = useLyricsPlugin();
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
