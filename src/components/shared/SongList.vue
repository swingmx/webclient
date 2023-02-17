<template>
  <div
    class="queue-view-virtual-scroller v-scroll-page"
    :class="{ isSmall, isMedium }"
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
        :is_queue_track="true"
        @playThis="handlePlay(index)"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import SongItem from "@/components/shared/SongItem.vue";
import { Track } from "@/interfaces";
import { isMedium, isSmall } from "@/stores/content-width";

defineProps<{
  tracks: Track[];
  is_queue?: boolean;
  handlePlay: (index: number) => void;
}>();

const itemHeight = 64;
</script>
