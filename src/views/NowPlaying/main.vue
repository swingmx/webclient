<template>
  <div class="now-playing-view">
    <DynamicScroller
      :items="scrollerItems"
      :min-item-size="64"
      class="scroller"
      style="height: 100%"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.props]"
          :data-index="index"
        >
          <component
            :key="index"
            :is="item.component"
            v-bind="item.props"
          ></component>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ScrollerItem } from "@/interfaces";

import Header from "@/components/NowPlaying/Header.vue";
import TrackItem from "@/components/shared/TrackItem.vue";
import useQueueStore from "@/stores/queue";

const header: ScrollerItem = {
  id: "header",
  component: Header,
};

const queue = useQueueStore();

const scrollerItems = computed(() => {
  const items = [header];

  const trackComponents = queue.tracklist.map((track) => {
    const index = track.index;

    return {
      id: index,
      component: TrackItem,
      props: {
        track,
        index: index,
        isCurrent: index === queue.currentindex,
        isCurrentPlaying: index === queue.currentindex && queue.playing,
        isQueueTrack: true,
      },
    };
  });

  return items.concat(trackComponents);
});
</script>

<style lang="scss">
.now-playing-view {
  height: 100%;
  margin-right: -$medium;
  margin-bottom: 2rem;
  // padding-bottom: 2rem;
  
  .track-item {
    // padding: $small 2rem;
    margin: 0 auto;
    max-width: 28rem;

    @include smallPhone {
      margin-left: -1.25rem;
    }

    border-radius: $small;
  }

  .vue-recycle-scroller {
    padding-bottom: 2rem;
  }
}
</style>
