<template>
  <div class="hotkeys no-scroll">
    <button @click.prevent="q.playPrev">
      <PrevSvg />
    </button>
    <button @click.prevent="q.playPause">
      <PauseSvg v-if="q.playing" />
      <PlaySvg v-else />
    </button>
    <button @click.prevent="q.playNext">
      <NextSvg />
    </button>
  </div>
</template>

<script setup lang="ts">
import useQStore from "@/stores/queue";

import {
  default as NextSvg,
  default as PrevSvg,
} from "../../../assets/icons/next.svg";
import PauseSvg from "../../../assets/icons/pause.svg";
import PlaySvg from "../../../assets/icons/play.svg";

const q = useQStore();
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
  }

  button:nth-child(2) {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr max-content 1fr;
    position: relative;
    margin-right: -$small;

    button:first-child {
      margin-left: $small;
    }
  }

  @media screen and (min-width: 550px) {
    &::before {
      content: "";
      position: absolute;
      height: 1.5rem;
      background-color: $gray4;
      width: 1px;
    }
  }
}
</style>
