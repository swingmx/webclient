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
        v-if="onNowPlaying"
        class="lyrics"
        :class="{ showStatus: lyrics.exists }"
        @click="onNowPlaying ? tabs.npToggleTab() : tabs.switchToLyrics()"
      >
        <LyricsSvg /> Lyrics
      </button>
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
import useQueueStore from "@/stores/queue";
import useTabs from "@/stores/tabs";
import useLyrics from "@/stores/lyrics";

import OptionsSvg from "@/assets/icons/more.svg";
import ShuffleSvg from "@/assets/icons/shuffle.svg";
import { showQueueContextMenu } from "@/helpers/contextMenuHandler";
import LyricsSvg from "@/assets/icons/lyrics.svg";

const tabs = useTabs();
const lyrics = useLyrics();
const queue = useQueueStore();

defineProps<{
  onNowPlaying?: boolean;
}>();

const context_showing = ref(false);

function showContextMenu(e: MouseEvent) {
  if (!queue.tracklist.length) return;

  showQueueContextMenu(e, context_showing);
}
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
    gap: $medium;

    .lyrics {
      position: relative;

      svg {
        transform: scale(0.6);
      }
    }

    .showStatus {
      &::after {
        content: "";
        height: $small;
        width: $small;
        background-color: $gray1;
        border-radius: 50%;
        color: $green;
        position: absolute;
        top: -2px;
        right: -2px;
      }
    }

    .menu {
      padding: 0 $smaller;

      svg {
        transform: scale(1.2) rotate(90deg);
      }
    }
  }
}
</style>
