<template>
  <div class="right-search-top-albums-or-artists">
    <ArtistCard
      v-for="artist in search.top_results.artists.slice(0, 3)"
      :key="artist.artisthash"
      :artist="artist"
    />
  </div>
</template>

<script setup lang="ts">
import useSearchStore from "@/stores/search";
import ArtistCard from "@/components/shared/ArtistCard.vue";

const search = useSearchStore();
</script>
