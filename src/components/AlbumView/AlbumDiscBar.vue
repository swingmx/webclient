<template>
  <div v-if="album_disc.is_album_disc_number" class="album_disc_header no-select">
    <div class="disc_number">Disc {{ album_disc.album_page_disc_number }}</div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { AlbumDisc } from "@/interfaces";

defineProps<{
  album_disc: AlbumDisc;
}>();
</script>

<style lang="scss">
.album_disc_header {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
  padding-left: 1rem;
  margin-top: $small;
  height: $song-item-height;

  .disc_number {
    font-size: $medium;
    font-weight: 500;
    opacity: 0.75;
  }

  @include largePhones {
    padding-left: 0.5rem !important;
  }
}
</style>
