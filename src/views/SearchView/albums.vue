<template>
    <NoItems
      :title="'No album results'"
      :description="desc"
      :icon="SearchSvg"
      :flag="!search.albums.value.length"
    />
  <div class="search-albums-view grid-page">
    <AlbumCard
      v-for="album in search.albums.value"
      :key="album.albumhash"
      :album="album"
    />
  </div>
</template>

<script setup lang="ts">
import AlbumCard from "@/components/shared/AlbumCard.vue";
import NoItems from "@/components/shared/NoItems.vue";
import useSearchStore from "@/stores/search";
import SearchSvg from "@/assets/icons/search.svg";
import { computed } from "vue";

const search = useSearchStore();

const desc = computed(() =>
  search.query === ""
    ? "Start typing to search for albums"
    : `Track results for '${search.query}' should appear here`
);
</script>

<style lang="scss">
.search-albums-view.grid-page {
  padding-right: $small;

  overflow: auto;
}
</style>
