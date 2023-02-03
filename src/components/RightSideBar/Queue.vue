<template>
  <QueueActions />
  <div
    class="queue-virtual-scroller"
    @mouseover="mouseover = true"
    @mouseout="mouseover = false"
  >
    <NoItems
      :flag="!queue.tracklist.length"
      :title="'No songs in queue'"
      :description="'When you start playing songs, they will appear here.'"
      :icon="QueueSvg"
    />
    <RecycleScroller
      class="scroller"
      id="queue-scrollable"
      style="height: 100%"
      :items="scrollerItems"
      :item-size="itemHeight"
      key-field="id"
      v-slot="{ item, index }"
    >
      <TrackItem
        :index="index"
        :track="item.track"
        :isCurrent="index === queue.currentindex"
        :isCurrentPlaying="index === queue.currentindex && queue.playing"
        :isQueueTrack="true"
        @playThis="playFromQueue(index)"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import useQStore from "@/stores/queue";

import TrackItem from "@/components/shared/TrackItem.vue";
import QueueActions from "./Queue/QueueActions.vue";
import NoItems from "../shared/NoItems.vue";
import QueueSvg from "@/assets/icons/queue.svg";

const itemHeight = 64;
const queue = useQStore();
const mouseover = ref(false);

const scrollerItems = computed(() => {
  return queue.tracklist.map((track) => ({
    track,
    id: track.filepath,
  }));
});

function playFromQueue(index: number) {
  queue.play(index);
}

const show_above = 1; // the number of tracks to show above the current track

function scrollToCurrent() {
  const elem = document.getElementById("queue-scrollable") as HTMLElement;

  const top = (queue.currentindex - show_above) * itemHeight;
  elem.scroll({
    top,
    behavior: "smooth",
  });
}

onMounted(() => {
  queue.setScrollFunction(scrollToCurrent, mouseover);
  queue.focusCurrentInSidebar();
});

onBeforeUnmount(() => {
  queue.setScrollFunction(() => {}, null);
});
</script>

<style lang="scss">
.queue-virtual-scroller {
  height: 100%;
  overflow: hidden;

  .vue-recycle-scroller {
    padding: 0 !important;
  }
}
</style>
