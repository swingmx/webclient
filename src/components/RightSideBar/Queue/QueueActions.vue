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
        class="menu"
        :class="{ 'btn-active': context_showing }"
        @click="showContextMenu"
      >
        <OptionsSvg />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useQueue from "@/stores/queue";

import { showQueueContextMenu } from "@/helpers/contextMenuHandler";

import OptionsSvg from "@/assets/icons/more.svg";
import ShuffleSvg from "@/assets/icons/shuffle.svg";

const queue = useQueue();

const context_showing = ref(false);

function showContextMenu(e: MouseEvent) {
  if (!queue.tracklist.length) return;

  showQueueContextMenu(e, context_showing);
}

defineProps<{
  onNowPlaying?: boolean;
}>();
</script>

<style lang="scss">
.queue-actions {
  display: flex;
  justify-content: space-between;
  gap: $small;
  margin: 1rem;
  margin-bottom: 0;

  .lyricsversion {
    display: flex;
    gap: 1rem;

    .save {
      background-color: transparent;
    }

    // hide on screens less than 600px
    @media screen and (max-width: 600px) {
      display: none;
    }
  }

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
    gap: $medium;

    .menu {
      padding: 0 $smaller;

      svg {
        transform: scale(1.2) rotate(90deg);
      }
    }
  }
}
</style>
