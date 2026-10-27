<template>
  <div id="tracks-results">
    <div v-if="!results.value.length" class="t-center">
      <h5>{{ $t('Search.NoTracksTitle') }}</h5>
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
import SearchWorkRow from "@/components/Classical/SearchWorkRow.vue";

const props = defineProps<{
  // list the classical movements instead of the other tracks
  movements?: boolean;
}>();

const queue = useQueue();
const search = useSearch();
const tracklist = useTracklist();

const results = computed(() => (props.movements ? search.movements : search.tracks));

function updateQueue(index: number) {
  tracklist.setFromSearch(search.query, results.value.value);
  queue.play(index);
}

const scrollerItems = computed(() => {
  const items: any[] = results.value.value.map((track, index) => {
    if (track.classical) {
      return {
        id: index,
        component: SearchWorkRow,
        props: { track, isCurrent: queue.currenttrackhash === track.trackhash },
      };
    }
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
      fetch_callback: props.movements ? search.loadMovements : search.loadTracks,
      showtext: results.value.more,
      outside_route: true,
    },
  });

  return items;
});

onMounted(() => {
  search.switchTab(props.movements ? "movements" : "tracks");
});
</script>

<style lang="scss">
#tracks-results {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr max-content;

  .scroller {
    padding-bottom: 0rem !important;
  }
}

#tracks-results .morexx {
  margin-top: 1rem;
}
</style>
