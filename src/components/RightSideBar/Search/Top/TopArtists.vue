<template>
  <div class="right-search-top-albums-or-artists">
    <ArtistCard
      v-for="artist in search.top_results.artists.slice(
        0,
        !onSearchPage ? 3 : search.top_results.artists.length
      )"
      :key="artist.artisthash"
      :artist="artist"
    />
  </div>
</template>

<script setup lang="ts">
import ArtistCard from "@/components/shared/ArtistCard.vue";
import useSearchStore from "@/stores/search";

const search = useSearchStore();

defineProps<{
  onSearchPage?: boolean;
}>();
</script>