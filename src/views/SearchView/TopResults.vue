<template>
  <div class="search-page-top-results">
    <NoItems
      :title="'No results'"
      :description="'We can\'t find any results for your search.'"
      :icon="SearchSvg"
      :flag="!search.top_results.top_result || !search.top_results.top_result.type"
    />
    <div v-if="search.top_results.top_result && search.top_results.top_result.type" class="header">
      <div class="top">
        <h3>Top Result</h3>
        <TopItem />
      </div>
      <div class="tracks">
        <h3>Tracks</h3>
        <TopTracks />
      </div>
    </div>
    <RecentItems
      v-if="search.top_results.artists.length"
      :title="'Artists'"
      :items="
        search.top_results.artists.map((i) => ({
          type: 'artist',
          item: i,
        }))
      "
    />
    <RecentItems
      v-if="search.top_results.albums.length"
      :title="'Albums'"
      :items="
        search.top_results.albums.map((i) => ({
          type: 'album',
          item: i,
        }))
      "
    />
  </div>
</template>

<script setup lang="ts">
import useSearchStore from "@/stores/search";

import SearchSvg from "@/assets/icons/search.svg";
import TopItem from "@/components/RightSideBar/Search/Top/TopItem.vue";
import TopTracks from "@/components/RightSideBar/Search/Top/TopTracks.vue";
import RecentItems from "@/components/shared/CardScroller.vue";
import NoItems from "@/components/shared/NoItems.vue";

const search = useSearchStore();
</script>

<style lang="scss">
.search-page-top-results {
  height: 100%;
  overflow: auto;
  padding: 0 $padright $padbottom $padleft;

  .header {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 1rem;

    .top > h3 {
      margin-left: $medium;
    }

    @include largePhones {
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

    @include largePhones {
      max-width: 100%;
    }

    @include mediumPhones {
      min-width: unset;
      max-width: 100%;
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

  @include allPhones {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
