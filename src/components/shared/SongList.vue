<template>
  <div
    class="queue-view-virtual-scroller v-scroll-page"
    :class="{ isSmall, isMedium, is_queue }"
    style="height: 100%"
  >
    <RecycleScroller
      class="scroller"
      id="songlist-scroller"
      style="height: 100%"
      :items="tracks.map((track) => ({ track, id: Math.random() }))"
      :item-size="itemHeight"
      key-field="id"
      v-slot="{ item, index }"
    >
      <SongItem
        :track="item.track"
        :index="index + 1"
        :is_queue_track="is_queue"
        @playThis="handlePlay(index)"
        :is_last="index == tracks.length - 1"
        :droppable="true"
        @trackDropped="dropHandler"
        :source="source"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import SongItem from "@/components/shared/SongItem.vue";
import { dropSources } from "@/composables/enums";
import { Track } from "@/interfaces";
import { isMedium, isSmall } from "@/stores/content-width";

defineProps<{
  tracks: Track[];
  is_queue?: boolean;
  handlePlay: (index: number) => void;
  dropHandler: (
    source: dropSources,
    track: Track,
    newIndex: number,
    oldIndex: number
  ) => void;
  source: dropSources;
}>();

const itemHeight = 64;
</script>

<style lang="scss">

.queue-view-virtual-scroller.is_queue {
  .songlist-item.current {
    background-color: $darkestblue !important;
    border: none;
  }
}
</style>
