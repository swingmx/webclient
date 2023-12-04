<template>
  <div class="search-tracks-view">
    <NoItems
      :title="'No track results'"
      :description="desc"
      :icon="SearchSvg"
      :flag="!search.tracks.value.length"
    />
    <div :class="{ isSmall, isMedium }" style="height: 100%">
      <RecycleScroller
        id="songlist-scroller"
        v-slot="{ item, index }"
        style="height: 100%"
        :items="scrollerItems"
        :item-size="64"
        key-field="id"
      >
        <component
          :is="item.component"
          v-bind="item.props"
          @playThis="playFromSearch(index)"
        />
      </RecycleScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import FetchMore from "@/components/SearchPage/FetchMore.vue";
import NoItems from "@/components/shared/NoItems.vue";
import SongItem from "@/components/shared/SongItem.vue";
import { isMedium, isSmall } from "@/stores/content-width";

import useQueue from "@/stores/queue";
import useSearch from "@/stores/search";
import useTracklist from "@/stores/queue/tracklist";

import SearchSvg from "@/assets/icons/search.svg";
import { dropSources } from "@/enums";

const queue = useQueue();
const search = useSearch();
const tracklist = useTracklist();

const desc = computed(() =>
  search.query === ""
    ? "Start typing to search for tracks"
    : `Track results for '${search.query}' should appear here`
);

interface scrollerItem {
  id: string | number | undefined;
  component: typeof SongItem | typeof FetchMore;
  props: Record<string, any>;
}

const scrollerItems = computed(() => {
  const items: scrollerItem[] = search.tracks.value.map((track, index) => ({
    id: index,
    component: SongItem,
    props: {
      track,
      index: index + 1,
      source: dropSources.search,
    },
  }));

  items.push({
    // set to random to force re-render
    id: Math.random(),
    component: FetchMore,
    props: {
      action: search.loadTracks,
    },
  });

  return items;
});

function playFromSearch(index: number) {
  tracklist.setFromSearch(search.query, search.tracks.value);
  queue.play(index);
}
</script>

<style lang="scss">
.search-tracks-view {
  height: 100%;

  .no-scroll {
    height: 100%;
  }

  #songlist-scroller {
    padding-right: $padright;
    padding-left: 0;
  }
}
</style>
