<template>
  <div class="now-playing-card t-center rounded">
    <SongCard />
  </div>
</template>

<script setup lang="ts">
import SongCard from "./NP/SongCard.vue";
</script>

<style lang="scss">
.now-playing-card {
  padding: 1rem;
}
</style>
