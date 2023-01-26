<template>
  <NoItems
      :title="'No artist results'"
      :description="desc"
      :icon="SearchSvg"
      :flag="!search.artists.value.length"
    />
  <div class="grid-page">
    <ArtistCard
      v-for="artist in search.artists.value"
      :key="artist.image"
      :artist="artist"
    />
  </div>
</template>

<script setup lang="ts">
import ArtistCard from "@/components/shared/ArtistCard.vue";
import NoItems from "@/components/shared/NoItems.vue";
import useSearchStore from "@/stores/search";
import SearchSvg from "@/assets/icons/search.svg";
import { computed } from "vue";

const search = useSearchStore();

const desc = computed(() =>
  search.query === ""
    ? "Start typing to search for artists"
    : `Track results for '${search.query}' should appear here`
);
</script>
