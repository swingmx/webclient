<template>
  <div
    class="genres-banner"
    :style="{
      color: album.info.colors ? getTextColor(album.info.colors[0]) : '',
    }"
  >
    <!-- :class="{
      nocontrast: album.info.colors ? isLight(album.info.colors[0]) : false,
    }" -->
    <div class="rounded pad-sm">
      {{ album.info.genres.length ? "Genres" : "No genres" }}
    </div>
    <div
      v-for="genre in album.info.genres"
      class="rounded pad-sm"
      :style="{
        backgroundColor: album.info.colors
          ? getBackgroundColor(album.info.colors[0])
          : '',
      }"
    >
      {{ genre }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useAlbumStore from "@/stores/pages/album";
import { isLight } from "@/composables/colors/album";

import { getTextColor, getBackgroundColor } from "@/utils/colortools/shift";

const album = useAlbumStore();

onMounted(async () => {
  // onMounted, fetch data to be used in the component below this one.
  const album = useAlbumStore();
  await album.fetchArtistAlbums();
});
</script>

<style lang="scss">
.genres-banner {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  font-size: 0.9rem;
  padding-left: $medium;
  text-transform: capitalize;
  user-select: none;

  div {
    background-color: $gray5;
    min-width: 4rem;
    text-align: center;
    outline: solid 1px $gray;
    padding: $small 1rem;
    font-weight: 700;

    &:first-child {
      background-color: white;
      color: black;
      outline-color: white;
      pointer-events: none;
    }

    &:hover {
      background-color: $pink !important;
      outline-color: $pink;
      color: $white;
    }
  }
}
</style>
