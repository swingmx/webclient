<template>
  <button
    class="pluginfindlyricsbtn circular"
    :class="{ showError: plugin.error }"
    @click="!plugin.error ? plugin.searchLyrics() : null"
  >
    <span v-if="plugin.error">{{ plugin.error }}</span>
    <span v-else-if="plugin.loading"> Searching... </span>
    <span v-else>Search online</span>
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
    height: 1rem;
    width: 1rem;
  }

  &.showError {
    background-color: transparent;
    color: $white;
    border: solid 2px;
  }
}
</style>
