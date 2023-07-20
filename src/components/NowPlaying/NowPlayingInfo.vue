<template>
  <div class="now-playing-info">
    <div class="text">
      <div class="title">{{ queue.currenttrack?.title || "Swing Music" }}</div>
      <ArtistName
        :artists="queue.currenttrack?.artist || null"
        :albumartists="queue.currenttrack?.albumartist || ''"
        v-if="queue.currenttrack"
      />
      <span class="artist rickroll" v-else>
        <a href="https://github.com/mungai-njoroge" target="_blank"
          >built by @mungai-njoroge ↗</a
        >
      </span>
    </div>
    <div class="actions">
      <HeartSvg
        :state="queue.currenttrack?.is_favorite"
        @handle-fav="$emit('handleFav', queue.currenttrackhash)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArtistName from "../shared/ArtistName.vue";
import HeartSvg from "../shared/HeartSvg.vue";

import useQueueStore from "@/stores/queue";

const queue = useQueueStore();

defineEmits<{
  (e: "handleFav", trackhash: string): void;
}>();
</script>

<style lang="scss">
.now-playing-info {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;
  margin-top: 1rem;

  .artist {
    font-size: 0.8rem;
    color: $gray1;
  }

  .rickroll {
    & > * {
      color: $gray1 !important;
    }
  }
}
</style>
