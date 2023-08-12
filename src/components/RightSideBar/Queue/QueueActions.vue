<template>
  <div class="queue-actions">
    <div class="left">
      <button v-wave class="shuffle-queue action" @click="queue.shuffleQueue">
        <ShuffleSvg />
        <span>Shuffle</span>
      </button>
    </div>
    <div class="right">
      <button
        v-wave
        class="go-to-source action"
        href="#"
        @click="queue.clearQueue"
      >
        <ClearSvg />
      </button>
      <button @click="modal.showSaveQueueAsPlaylistModal">
        Save {{ isSmallPhone ? "" : "As Playlist" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useQueueStore from "@/stores/queue";
import useModalStore from "@/stores/modal";

import ClearSvg from "@/assets/icons/delete.svg";
import ShuffleSvg from "@/assets/icons/shuffle.svg";
import { isSmallPhone } from "@/stores/content-width";

const queue = useQueueStore();
const modal = useModalStore();
</script>

<style lang="scss">
.queue-actions {
  display: flex;
  justify-content: space-between;
  gap: $small;
  margin: 1rem;
  margin-bottom: 0;

  .left {
    display: flex;
    gap: $small;
  }

  .action {
    padding: 0 $medium;

    svg {
      transform: scale(0.8);
    }
  }

  .right {
    display: flex;
    gap: $small;
    .go-to-source {
      padding: 0 $smaller;
    }
  }
}
</style>
