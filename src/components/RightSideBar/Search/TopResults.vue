<template>
  <div class="right-top-results">
    <NoItems
      :title="'No results'"
      :description="'We can\'t find any results for your search.'"
      :icon="SearchSvg"
      :flag="
        !search.top_results.top_result || !search.top_results.top_result.type
      "
    />
    <div
      v-if="search.top_results.top_result && search.top_results.top_result.type"
    >
      <h3 class="h3">Top Result</h3>
      <TopItem />
    </div>
    <div v-if="search.top_results.tracks.length">
      <h3 class="h3">Tracks</h3>
      <TopTracks />
    </div>
    <div v-if="search.top_results.artists.length">
      <h3 class="h3">Artists</h3>
      <TopArtists />
    </div>
    <div v-if="search.top_results.albums.length">
      <h3 class="h3">Albums</h3>
      <TopAlbums />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopItem from "./Top/TopItem.vue";
import TopAlbums from "./Top/TopAlbums.vue";
import TopTracks from "./Top/TopTracks.vue";

import useSearchStore from "@/stores/search";
import TopArtists from "./Top/TopArtists.vue";
import NoItems from "@/components/shared/NoItems.vue";
import SearchSvg from "@/assets/icons/search.svg";

const search = useSearchStore();
</script>

<style lang="scss">
.right-top-results {
  padding-bottom: 2rem;
  height: 100%;

  .h3 {
    padding: 0 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>
