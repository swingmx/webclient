<template>
  <div class="now-playing-info">
    <div class="text">
      <div class="title">{{ queue.currenttrack?.title || "Swing Music" }}</div>
      <ArtistName
        v-if="queue.currenttrack"
        :artists="queue.currenttrack?.artists || null"
        :albumartists="queue.currenttrack?.albumartists || ''"
      />
      <span v-else class="artist author">
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

  .heart-button {
    background-color: $gray;

    &:hover {
      background-color: $gray4;
    }
  }

  .author {
    & > * {
      color: $gray1 !important;
    }
  }
}
</style>
