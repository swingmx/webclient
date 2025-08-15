<template>
  <div
    v-if="$route.params.tab == 'home'"
    class="now-playing-view v-scroll-page scroller"
    :class="{ isSmall, isMedium }"
  >
    <Header />
    <draggable
      v-model="tracklist"
      item-key="id"
      handle=".song-item"
      @end="onDragEnd"
      style="height: 100%"
    >
      <template #item="{ element, index }">
          <SongItem
          :track="element"
          :index="index + 1"
          :isCurrent="index === queue.currentindex"
          :isCurrentPlaying="index === queue.currentindex && queue.playing"
          :isQueueTrack="true"
          :source="dropSources.queue"
          class="song-item"
          @playThis="playFromQueue(index)"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Draggable from "vuedraggable";
import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";
import { isMedium, isSmall } from "@/stores/content-width";
import Header from "@/components/NowPlaying/Header.vue";
import SongItem from "@/components/shared/SongItem.vue";
import updatePageTitle from "@/utils/updatePageTitle";
import { dropSources } from "@/enums";

const queue = useQueueStore();
const store = useTracklist();

const tracklist = ref([...store.tracklist]);

watch(
  () => store.tracklist,
  (newList) => {
    tracklist.value = [...newList];
  }
);

function playFromQueue(index: number) {
  queue.play(index);
}

function onDragEnd() {
  // Update the store's tracklist with the new order
  store.tracklist = [...tracklist.value];
}

onMounted(() => updatePageTitle("Now Playing"));
</script>
<style lang="scss">
.now-playing-view {
  height: 100%;
}

.scroller {
  height: 100%;
  overflow-y: auto;
  padding: 0 10px;
}

.song-item {
  cursor: grab;
  width: 100%;
}

</style>
