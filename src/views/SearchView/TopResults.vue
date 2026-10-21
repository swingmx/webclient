<template>
  <div class="search-page-top-results">
    <NoItems
      :title="$t('Common.NoResults')"
      :description="$t('Common.NoSearchResults')"
      :icon="SearchSvg"
      :flag="!search.top_results.top_result || !search.top_results.top_result.type"
    />
    <div v-if="search.top_results.top_result && search.top_results.top_result.type" class="header">
      <div class="top">
        <h3>{{ $t('Common.TopResult') }}</h3>
        <ClassicalTopItem v-if="classicalTop" />
        <TopItem v-else />
      </div>
      <div v-if="showWorks" class="tracks">
        <h3>{{ $t('Views.ComposerView.Works') }}</h3>
        <SearchWorkRow v-for="work in search.top_results.works" :key="work.workhash" :work="work" />
      </div>
      <div v-else class="tracks">
        <h3>{{ $t('Common.Track', 2) }}</h3>
        <TopTracks />
      </div>
    </div>
    <RecentItems
      v-if="search.top_results.artists.length"
      :title="$t('Common.Artist', 2)"
      :items="
        search.top_results.artists.map((i) => ({
          type: 'artist',
          item: i,
        }))
      "
    />
    <RecentItems
      v-if="search.top_results.albums.length"
      :title="$t('Common.Album', 2)"
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
import { computed } from "vue";

import useSearchStore from "@/stores/search";
import { isClassicalTop, showTopWorks } from "@/utils/searchTop";

import SearchSvg from "@/assets/icons/search.svg";
import SearchWorkRow from "@/components/Classical/SearchWorkRow.vue";
import ClassicalTopItem from "@/components/RightSideBar/Search/Top/ClassicalTopItem.vue";
import TopItem from "@/components/RightSideBar/Search/Top/TopItem.vue";
import TopTracks from "@/components/RightSideBar/Search/Top/TopTracks.vue";
import RecentItems from "@/components/shared/CardScroller.vue";
import NoItems from "@/components/shared/NoItems.vue";

const search = useSearchStore();
const classicalTop = computed(() => isClassicalTop(search.top_results.top_result));
const showWorks = computed(() => showTopWorks(search.top_results));
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
