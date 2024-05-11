<template>
  <div
    class="genres-banner"
    :style="{
      color: color ? getShift(color, [100, -100]) : '',
    }"
  >
    <div class="scrollable">
      <div class="rounded pad-sm genre-pill">
        {{ genres.length ? "Genres" : "No genres" }}
      </div>
      <div
        v-for="genre in genres"
        :key="genre"
        class="genre-pill rounded pad-sm"
        :style="{
          backgroundColor: color,
        }"
      >
        {{ genre }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAlbumStore from "@/stores/pages/album";
import useArtistStore from "@/stores/pages/artist";
import { computed, onMounted } from "vue";

import { getShift } from "@/utils/colortools/shift";

const album = useAlbumStore();
const store = useArtistStore();

const props = defineProps<{
  source: string;
}>();

const genres = computed(() => {
  return props.source === "album" ? album.info.genres : store.genres;
});

const color = computed(() => {
  return props.source === "album" ? album.colors.btn : "";
});

const hookAction = async () => {
  if (props.source === "album") {
    // fetch data to be used in the component below this one.
    await album.fetchArtistAlbums();
    return;
  }
};

onMounted(hookAction);
</script>

<style lang="scss">
.genres-banner {
  margin-top: 2rem;
  padding-bottom: 2rem;
  font-size: 0.9rem;
  padding-left: $medium;
  text-transform: capitalize;
  user-select: none;
  overflow: scroll;
  @include hideScrollbars;

  .scrollable {
    display: flex;
    flex-wrap: nowrap;
    width: max-content;
    gap: 1rem;
    padding-right: $medium;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .genre-pill {
    background-color: $gray5;
    min-width: 4rem;
    text-align: center;
    padding: $small 1rem;
    font-weight: 700;
    transition: background-color 0.2s ease-out, color 0.2s ease-out;

    &:first-child {
      background-color: white;
      color: black;
      pointer-events: none;
    }

    &:hover {
      background-color: $pink !important;
      color: $white;
    }
  }
}
</style>
