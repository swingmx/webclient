<template>
  <div id="tracks-results">
    <div v-if="search.tracks.value.length">
      <TrackItem
        v-for="(track, index) in search.tracks.value"
        :key="track.id"
        :isCurrent="queue.currenttrackhash === track.trackhash"
        :isHighlighted="false"
        :isCurrentPlaying="
          queue.currenttrackhash === track.trackhash && queue.playing
        "
        :track="track"
        @playThis="updateQueue(index)"
        :index="index + 1"
      />
    </div>
    <div v-else class="t-center"><h5>No tracks</h5></div>
    <LoadMore
      :loader="search.loadTracks"
      :can_load_more="search.tracks.more"
      v-if="search.tracks.value.length"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import TrackItem from "@/components/shared/TrackItem.vue";
import useQStore from "@/stores/queue";
import useSearchStore from "@/stores/search";
import LoadMore from "./LoadMore.vue";

const queue = useQStore();
const search = useSearchStore();

function updateQueue(index: number) {
  queue.playFromSearch(search.query, search.tracks.value);
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
