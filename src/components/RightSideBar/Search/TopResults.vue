<template>
  <div class="right-top-results">
    <NoItems
      :title="t('Search.NoResultsTitle')"
      :description="t('Search.NoResultsDescription')"
      :icon="SearchSvg"
      :flag="
        !search.top_results.top_result || !search.top_results.top_result.type
      "
    />
    <div
      v-if="search.top_results.top_result && search.top_results.top_result.type"
    >
      <h3 class="h3">{{ t('Search.TopResult') }}</h3>
      <TopItem />
    </div>
    <div v-if="search.top_results.tracks.length">
      <h3 class="h3">{{ t('Search.Tracks') }}</h3>
      <TopTracks />
    </div>
    <div v-if="search.top_results.artists.length">
      <h3 class="h3">{{ t('Search.Artists') }}</h3>
      <TopArtists />
    </div>
    <div v-if="search.top_results.albums.length">
      <h3 class="h3">{{ t('Search.Albums') }}</h3>
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

import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
