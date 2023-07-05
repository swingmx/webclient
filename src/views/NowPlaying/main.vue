<template>
  <div class="now-playing-view v-scroll-page" :class="{ isSmall, isMedium }">
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
import { isMedium, isSmall } from "@/stores/content-width";

import Header from "@/components/NowPlaying/Header.vue";
import useQueueStore from "@/stores/queue";
import SongItem from "@/components/shared/SongItem.vue";
import { FromOptions } from "@/composables/enums";

const header: ScrollerItem = {
  id: "header",
  component: Header,
};

const queue = useQueueStore();

const scrollerItems = computed(() => {
  const items = [header];

  const trackComponents = queue.tracklist.map((track, index) => {
    return {
      id: index,
      component: SongItem,
      props: {
        track,
        index: index + 1,
        isCurrent: index === queue.currentindex,
        isCurrentPlaying: index === queue.currentindex && queue.playing,
        isQueueTrack: true,
        source: queue.from.type,
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
    max-width: 26rem;

    // @include smallPhone {
    //   margin-left: -$medium;
    // }

    // border-radius: $small;
  }

  .vue-recycle-scroller {
    padding-bottom: 2rem;
  }
}
</style>
