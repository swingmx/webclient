<template>
  <div id="tracks-results">
    <div v-if="search.tracks.value.length">
      <TrackItem
        v-for="(track, index) in search.tracks.value"
        :key="track.id"
        :is-current="queue.currenttrackhash === track.trackhash"
        :is-highlighted="false"
        :is-current-playing="
          queue.currenttrackhash === track.trackhash && queue.playing
        "
        :track="track"
        :index="index + 1"
        @playThis="updateQueue(index)"
      />
    </div>
    <div v-else class="t-center"><h5>No tracks</h5></div>
    <LoadMore
      v-if="search.tracks.value.length"
      :loader="search.loadTracks"
      :can_load_more="search.tracks.more"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import useQueue from "@/stores/queue";
import useSearch from "@/stores/search";
import useTracklist from "@/stores/queue/tracklist";

import LoadMore from "./LoadMore.vue";
import TrackItem from "@/components/shared/TrackItem.vue";

const queue = useQueue();
const search = useSearch();
const tracklist = useTracklist();

function updateQueue(index: number) {
  tracklist.setFromSearch(search.query, search.tracks.value);
  queue.play(index);
}

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
