<template>
  <div class="right-top-results">
    <NoItems
      :title="$t('Search.NoResultsTitle')"
      :description="$t('Search.NoResultsDescription')"
      :icon="SearchSvg"
      :flag="
        !search.top_results.top_result || !search.top_results.top_result.type
      "
    />
    <div
      v-if="search.top_results.top_result && search.top_results.top_result.type"
    >
      <h3 class="h3">{{ $t('Search.TopResult') }}</h3>
      <ClassicalTopItem v-if="classicalTop" />
      <TopItem v-else />
    </div>
    <div v-if="showWorks">
      <h3 class="h3">{{ $t('Views.ComposerView.Works') }}</h3>
      <div class="right-search-top-works">
        <SearchWorkRow v-for="work in search.top_results.works" :key="work.workhash" :work="work" />
      </div>
    </div>
    <div v-else-if="search.top_results.tracks.length">
      <h3 class="h3">{{ $t('Common.Track', 2) }}</h3>
      <TopTracks />
    </div>
    <div v-if="search.top_results.artists.length">
      <h3 class="h3">{{ $t('Common.Artist', 2) }}</h3>
      <TopArtists />
    </div>
    <div v-if="search.top_results.albums.length">
      <h3 class="h3">{{ $t('Common.Album', 2) }}</h3>
      <TopAlbums />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import TopItem from "./Top/TopItem.vue";
import ClassicalTopItem from "./Top/ClassicalTopItem.vue";
import SearchWorkRow from "@/components/Classical/SearchWorkRow.vue";
import { isClassicalTop, showTopWorks } from "@/utils/searchTop";
import TopAlbums from "./Top/TopAlbums.vue";
import TopTracks from "./Top/TopTracks.vue";

import useSearchStore from "@/stores/search";
import TopArtists from "./Top/TopArtists.vue";
import NoItems from "@/components/shared/NoItems.vue";
import SearchSvg from "@/assets/icons/search.svg";

const search = useSearchStore();
const classicalTop = computed(() => isClassicalTop(search.top_results.top_result));
const showWorks = computed(() => showTopWorks(search.top_results));
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

  .right-search-top-works {
    margin: 0 1rem 2rem $small;
  }
}
</style>
