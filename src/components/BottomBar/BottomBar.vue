<template>
  <div
    class="b-bar"
    :style="{
      padding: `${settings.is_default_layout ? '0 1rem 0 1rem' : ''}`,
    }"
  >
    <LeftGroup @handleFav="handleFav" />
    <div class="center">
      <div v-if="!isMobile" class="with-time">
        <div class="time time-current">
          <span>
            {{ formatSeconds(queue.duration.current || 0) }}
          </span>
        </div>

        <div class="buttons rounded-sm border">
          <HotKeys />
        </div>
        <div class="time time-full">
          <span>
            {{ formatSeconds(queue.duration.full) }}
          </span>
        </div>
      </div>
      <Progress />
    </div>
    <RightGroup v-if="!isMobile" @handleFav="handleFav" />
    <Navigation v-else />
  </div>
</template>

<script setup lang="ts">
import { favType } from "@/enums";
import favoriteHandler from "@/helpers/favoriteHandler";
import { isMobile } from "@/stores/content-width";
import { formatSeconds } from "@/utils";

import useQStore from "@/stores/queue";
import useSettings from "@/stores/settings";

import HotKeys from "@/components/LeftSidebar/NP/HotKeys.vue";
import Progress from "@/components/LeftSidebar/NP/Progress.vue";
import Navigation from "@/components/LeftSidebar/NavButtons.vue";

import LeftGroup from "./Left.vue";
import RightGroup from "./Right.vue";

const queue = useQStore();
const settings = useSettings();

function handleFav() {
  favoriteHandler(
    queue.currenttrack?.is_favorite,
    favType.track,
    queue.currenttrack?.trackhash || "",
    () => null,
    () => null
  );
}
</script>

<style lang="scss">
.b-bar {
  background-color: rgb(22, 22, 22);
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  align-items: center;
  z-index: 1;

  @include allPhones {
    grid-template-columns: 1fr;
    grid-template-rows: max-content 1.5rem max-content;
    padding: 0 1rem $medium 1rem;

    .center > input {
      height: 2px !important;
    }
  }

  button {
    background: transparent;
    border-radius: $small;
    width: 3rem;
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;

    &:hover {
      border: solid 1px $gray3 !important;
      background-color: $gray !important;
    }

    @include allPhones {
      height: 3rem;
    }
  }

  &:hover {
    // INFO: Show the progress bar when hovering over the bottom bar
    #progress::-moz-range-thumb {
      height: 1rem;
      width: 1rem;
    }

    #progress::-webkit-slider-thumb {
      height: 1rem;
      width: 1rem;
    }

    #progress::-ms-thumb {
      height: 1rem;
      width: 1rem;
    }

    // INFO: Also show the expand button
    .np-image .expandicon {
      opacity: 1;
    }
  }

  .with-time {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: flex-end;
    height: 2rem;

    button {
      background: transparent;
    }
  }

  .center {
    display: grid;
    align-items: center;
    gap: $small;
    margin-bottom: -$smallest;

    width: 30rem;

    @media (max-width: 1080px) {
      width: 20rem !important;
    }

    @include allPhones {
      width: 100% !important;
      margin-bottom: $small;
    }

    .time {
      font-size: $medium;
      height: fit-content;
      width: 3rem;

      span {
        background-color: $gray3;
        border-radius: $smaller;
        padding: 1px $smaller;
        font-variant-numeric: tabular-nums;
      }
    }

    .time-full {
      text-align: end;
    }
  }

  // hotkey
  .buttons {
    display: grid;
    place-items: center;
    transform: scale(1.2);
    border: none;
  }
}
</style>
