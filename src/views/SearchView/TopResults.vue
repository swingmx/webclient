<template>
  <div class="search-page-top-results">
    <NoItems
      :title="'No results'"
      :description="'We can\'t find any results for your search.'"
      :icon="SearchSvg"
      :flag="
        !search.top_results.top_result || !search.top_results.top_result.type
      "
    />
    <div class="header">
      <div
        v-if="
          search.top_results.top_result && search.top_results.top_result.type
        "
        class="top"
      >
        <h3>Top Result</h3>
        <TopItem />
      </div>
      <div class="tracks">
        <h3>Tracks</h3>
        <TopTracks />
      </div>
    </div>
    <div v-if="search.top_results.artists.length">
      <RecentItems
        :title="'Artists'"
        :items="
          search.top_results.artists.map((i) => ({
            type: 'artist',
            item: i,
          }))
        "
        :route="`/search/artists?q=${search.query}`"
      />
    </div>
    <div v-if="search.top_results.albums.length">
      <RecentItems
        :title="'Albums'"
        :items="
          search.top_results.albums.map((i) => ({
            type: 'album',
            item: i,
          }))
        "
        :route="`/search/albums?q=${search.query}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useSearchStore from "@/stores/search";

import SearchSvg from "@/assets/icons/search.svg";
import NoItems from "@/components/shared/NoItems.vue";
import RecentItems from "@/components/HomeView/RecentItems.vue";
import TopItem from "@/components/RightSideBar/Search/Top/TopItem.vue";
import TopTracks from "@/components/RightSideBar/Search/Top/TopTracks.vue";

const search = useSearchStore();
</script>

<style lang="scss">
.search-page-top-results {
  height: 100%;
  overflow: auto;

  .header {
    margin-right: 1.25rem;
    display: grid;
    grid-template-columns: max-content 1fr;
    margin-bottom: 2rem;
    gap: $medium;

    @include allPhones {
      grid-template-columns: 1fr;
    }
  }

  h3 {
    margin: $small;
  }

  .top-result-item {
    height: max-content;
    margin: 0;

    h3 {
      margin-left: 0;
    }
  }

  .track-item {
    border-radius: $small;
    padding-left: $small;
    margin-top: $smaller;
  }

  .right-search-top-albums-or-artists {
    display: flex;
    width: calc(100% - 1.25rem);
    overflow-x: auto;

    @include hideScrollbars;
  }
}
</style>
