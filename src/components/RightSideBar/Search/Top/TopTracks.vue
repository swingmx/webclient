<template>
  <div class="right-search-top-tracks">
    <TrackItem
      v-for="(track, index) in search.top_results.tracks"
      :key="track.id"
      :track="track"
      :index="index"
      :is-current="false"
      :is-current-playing="false"
      @play-this="handlePlay(track)"
    />
  </div>
</template>

<script setup lang="ts">
import { Track } from "@/interfaces";

import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";
import useSearchStore from "@/stores/search";

import TrackItem from "@/components/shared/TrackItem.vue";

const search = useSearchStore();
const queue = useQueueStore();
const tracklist = useTracklist();

function handlePlay(track: Track) {
  queue.clearQueue();
  tracklist.setFromSearch(search.query, [track]);
  queue.play(0);
}
</script>

<style lang="scss">
.right-search-top-tracks {
  margin-bottom: 2rem;

  .track-item {
    padding: $small;
  }
}
</style>
