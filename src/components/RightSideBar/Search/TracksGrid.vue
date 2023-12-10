<template>
  <div id="tracks-results">
    <div v-if="!search.tracks.value.length" class="t-center">
      <h5>No tracks</h5>
    </div>

    <RecycleScroller
      v-slot="{ item, index }"
      class="scroller"
      style="height: 100%"
      :items="scrollerItems"
      :item-size="64"
      key-field="id"
    >
      <component
        :is="item.component"
        v-bind="item.props"
        @playThis="updateQueue(index)"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

import useQueue from "@/stores/queue";
import useSearch from "@/stores/search";
import useTracklist from "@/stores/queue/tracklist";

import TrackItem from "@/components/shared/TrackItem.vue";
import AlbumsFetcher from "@/components/ArtistView/AlbumsFetcher.vue";

const queue = useQueue();
const search = useSearch();
const tracklist = useTracklist();

function updateQueue(index: number) {
  tracklist.setFromSearch(search.query, search.tracks.value);
  queue.play(index);
}

const scrollerItems = computed(() => {
  const items: any[] = search.tracks.value.map((track, index) => {
    return {
      track,
      id: index,
      component: TrackItem,
      props: {
        track,
        index: index + 1,
        isCurrent: queue.currenttrackhash === track.trackhash,
        isCurrentPlaying:
          queue.currenttrackhash === track.trackhash && queue.playing,
        isHighlighted: false,
      },
    };
  });

  items.push({
    id: Math.random(),
    component: AlbumsFetcher,
    props: {
      fetch_callback: search.loadTracks,
      showtext: search.tracks.more,
      outside_route: true,
    },
  });

  return items;
});

onMounted(() => {
  search.switchTab("tracks");
});
</script>

<style lang="scss">
#tracks-results {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr max-content;
}

#tracks-results .morexx {
  margin-top: 1rem;
}
</style>
