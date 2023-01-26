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
        style="height: 100%"
        :items="scrollerItems"
        :item-size="64"
        key-field="id"
        v-slot="{ item, index }"
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

import useQueueStore from "@/stores/queue";
import useSearchStore from "@/stores/search";
import { isMedium, isSmall } from "@/stores/content-width";
import SongItem from "@/components/shared/SongItem.vue";
import FetchMore from "@/components/SearchPage/FetchMore.vue";
import NoItems from "@/components/shared/NoItems.vue";

import state from "@/composables/state";

import SearchSvg from "@/assets/icons/search.svg";

const search = useSearchStore();
const queue = useQueueStore();

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
    id: track.filepath,
    component: SongItem,
    props: {
      track,
      index: index + 1,
    },
  }));

  items.push({
    id: Math.random(),
    component: FetchMore,
    props: {
      action: search.loadTracks,
    },
  });

  return items;
});

function playFromSearch(index: number) {
  queue.playFromSearch(search.query, search.tracks.value);
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
    padding-right: 1rem;
    padding-left: 0;
  }
}
</style>
