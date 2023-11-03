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
  <LyricsBody v-if="$route.params.tab == 'lyrics'" />
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ScrollerItem } from "@/interfaces";
import { isMedium, isSmall } from "@/stores/content-width";

import Header from "@/components/NowPlaying/Header.vue";
import useQueueStore from "@/stores/queue";
import SongItem from "@/components/shared/SongItem.vue";
import updatePageTitle from "@/utils/updatePageTitle";
import Tabs from "@/components/NowPlaying/Tabs.vue";
import LyricsBody from "@/components/RightSideBar/Lyrics/Body.vue";

const header: ScrollerItem = {
  id: "header",
  component: Header,
};

const tabs: ScrollerItem = {
  id: "tabs",
  component: Tabs,
};

const queue = useQueueStore();

function playFromQueue(index: number) {
  queue.play(index);
}

const scrollerItems = computed(() => {
  const items = [header, tabs];

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

onMounted(() => updatePageTitle("Now Playing"));
</script>

<style lang="scss">
.now-playing-view {
  height: 100%;
  margin-right: -$medium;
  margin-bottom: 2rem;

  .track-item {
    margin: 0 auto;
    max-width: 26rem;
  }

  .vue-recycle-scroller {
    padding-bottom: 2rem;
  }
}
</style>
