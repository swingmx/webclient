<template>
  <NoItems
    :flag="!queue.tracklist.length"
    :title="'No songs in queue'"
    :description="'When you start playing songs, they will appear here.'"
    :icon="QueueSvg"
  />
  <SongList
    :tracks="queue.tracklist"
    :handlePlay="playFromQueue"
    :is_queue="true"
    :dropHandler="queue.addTrackToIndex"
    :source="dropSources.queue"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useQStore from "@/stores/queue";
import SongList from "@/components/shared/SongList.vue";
import NoItems from "@/components/shared/NoItems.vue";

import QueueSvg from "@/assets/icons/queue.svg";
import { dropSources } from "@/composables/enums";

const queue = useQStore();
function playFromQueue(index: number) {
  queue.play(index);
}

const show_above = 1; // the number of tracks to show above the current track

function scrollToCurrent() {
  const scrollable = document.getElementById(
    "songlist-scroller"
  ) as HTMLElement;

  if (scrollable?.scrollTop > 0) {
    // user has scrolled
    return;
  }

  const itemHeight = 64;
  const top = (queue.currentindex - show_above) * itemHeight;

  scrollable?.scrollTo({
    top,
    behavior: "smooth",
  });
}

onMounted(() => {
  setTimeout(() => {
    scrollToCurrent();
  }, 1000);
});
</script>
