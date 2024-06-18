<template>
  <div class="hotkeys no-scroll">
    <button @click.prevent="queue.playPrev">
      <PrevSvg />
    </button>
    <button @click.prevent="queue.playPause">
      <Spinner v-if="buffering && queue.playing" />
      <PauseSvg v-else-if="queue.playing" />
      <PlaySvg v-else />
    </button>
    <button @click.prevent="queue.playNext">
      <NextSvg />
    </button>
  </div>
</template>

<script setup lang="ts">
import { buffering } from "@/stores/player";
import useQStore from "@/stores/queue";

import { default as NextSvg, default as PrevSvg } from "@/assets/icons/next.svg";
import PauseSvg from "@/assets/icons/pause.svg";
import PlaySvg from "@/assets/icons/play.svg";
import Spinner from "@/components/shared/Spinner.vue";

const queue = useQStore();
</script>

<style lang="scss">
.hotkeys {
  display: grid;
  grid-template-columns: 1fr 4rem 1fr;
  gap: 1rem;
  height: 100%;
  align-items: center;

  button {
    height: 100%;
    padding: 0;
    background: none;
    border: 1px solid transparent;
    border-radius: 0;

    &:hover {
      background: $darkestblue;
    }
  }

  button:first-child {
    svg {
      transform: rotate(180deg);
    }

    &:active {
      svg {
        transform: rotate(180deg) scale(0.75);
      }
    }
  }

  button:nth-child(2) {
    width: 4rem;
  }

  @include allPhones {
    grid-template-columns: 1fr max-content 1fr;
    position: relative;
    margin-right: -$small;
    gap: 0;

    button:first-child {
      margin-left: $small;
    }
  }

  @include largePhones {
    display: flex;
    flex-shrink: 0;

    button:first-child {
      margin-left: $smaller;
    }
  }
}
</style>
