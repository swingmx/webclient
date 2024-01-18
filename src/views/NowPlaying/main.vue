<template>
  <div
    v-if="$route.params.tab == 'home'"
    class="now-playing-view v-scroll-page"
    :class="{ isSmall, isMedium }"
  >
    <DynamicScroller
      :items="scrollerItems"
      :min-item-size="64"
      class="scroller"
      style="height: 100%"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.props]"
          :data-index="index"
        >
          <component
            :is="item.component"
            :key="index"
            v-bind="item.props"
            @playThis="playFromQueue(item.props.index - 1)"
          ></component>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ScrollerItem } from "@/interfaces";

import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";
import { isMedium, isSmall } from "@/stores/content-width";

import Header from "@/components/NowPlaying/Header.vue";
import SongItem from "@/components/shared/SongItem.vue";
import updatePageTitle from "@/utils/updatePageTitle";

const header: ScrollerItem = {
  id: "header",
  component: Header,
};

const queue = useQueueStore();
const store = useTracklist();

function playFromQueue(index: number) {
  queue.play(index);
}

const scrollerItems = computed(() => {
  const items = [header];

  const trackComponents = store.tracklist.map((track, index) => {
    track.index = index; // used in context menu to remove from queue
    return {
      id: index,
      component: SongItem,
      props: {
        track,
        index: index + 1,
        isCurrent: index === queue.currentindex,
        isCurrentPlaying: index === queue.currentindex && queue.playing,
        isQueueTrack: true,
        source: store.from.type,
      },
    };
  });

  return items.concat(trackComponents);
});

onMounted(() => updatePageTitle("Now Playing"));
</script>

<style lang="scss">
.now-playing-view {
  height: 100%;
}
</style>
