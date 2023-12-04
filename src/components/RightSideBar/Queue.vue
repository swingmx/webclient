<template>
  <QueueActions />
  <div
    class="queue-virtual-scroller"
    @mouseover="mouseover = true"
    @mouseout="mouseover = false"
  >
    <NoItems
      :flag="!store.tracklist.length"
      :title="'No songs in queue'"
      :description="'When you start playing songs, they will appear here.'"
      :icon="QueueSvg"
    />
    <RecycleScroller
      id="queue-scrollable"
      v-slot="{ item, index }"
      class="scroller"
      style="height: 100%"
      :items="scrollerItems"
      :item-size="itemHeight"
      key-field="id"
    >
      <TrackItem
        :index="index"
        :track="item.track"
        :is-current="index === queue.currentindex"
        :is-current-playing="index === queue.currentindex && queue.playing"
        :is-queue-track="true"
        @playThis="playFromQueue(index)"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import useQStore from "@/stores/queue";
import useInterface from "@/stores/interface";
import useTracklist from "@/stores/queue/tracklist";

import NoItems from "../shared/NoItems.vue";
import QueueActions from "./Queue/QueueActions.vue";
import TrackItem from "@/components/shared/TrackItem.vue";
import QueueSvg from "@/assets/icons/queue.svg";

const itemHeight = 64;
const queue = useQStore();
const store = useTracklist();
const mouseover = ref(false);

const { focusCurrentInSidebar, setScrollFunction } = useInterface();

const scrollerItems = computed(() => {
  return store.tracklist.map((track, index) => ({
    track,
    id: index,
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
  setScrollFunction(scrollToCurrent, mouseover);
  focusCurrentInSidebar();
});

onBeforeUnmount(() => {
  setScrollFunction(() => {}, null);
});
</script>

<style lang="scss">
.queue-virtual-scroller {
  height: 100%;
  overflow: hidden;
}
</style>
