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
    </div>
  </div>
</template>

<script setup lang="ts">
import useQueueStore from "../../../stores/queue";

import ClearSvg from "@/assets/icons/delete.svg";
import ShuffleSvg from "@/assets/icons/shuffle.svg";

const queue = useQueueStore();
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
    .go-to-source {
      padding: 0 $smaller;
    }
  }
}
</style>
