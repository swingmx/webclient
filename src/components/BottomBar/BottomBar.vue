<template>
  <div
    class="b-bar"
    :style="{
      paddingLeft: `${settings.is_default_layout ? '1rem' : ''}`,
      paddingRight: `${settings.is_default_layout ? '1rem' : ''}`,
    }"
  >
    <LeftGroup @handleFav="handleFav" />
    <div class="center">
      <div v-if="!isMobile" class="with-time">
        <div class="time time-current">
          <div class="numbers">
            {{ formatSeconds(queue.duration.current || 0) }}
          </div>
        </div>

        <div class="buttons rounded-sm border">
          <HotKeys />
        </div>
        <div class="time time-full">
          <div class="numbers">
            {{ formatSeconds(queue.duration.full) }}
          </div>
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
    display: flex;
    flex-direction: column;
    align-items: unset;
    gap: $small;
    padding: $medium 1rem;

    /* Hiding the dot/thumb/handle for readonly input */
    /* Webkit browsers, Firefox, IE etc */
    &:hover > .center > #progress::-webkit-slider-thumb {
      display: none;
      opacity: 0;
      visibility: hidden;
    }

    &:hover > .center > #progress::-moz-range-thumb {
      display: none;
      opacity: 0;
      visibility: hidden;
    }

    &:hover > .center > #progress::-ms-thumb {
      display: none;
      opacity: 0;
      visibility: hidden;
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

    @include largePhones {
      width: 2.5rem;
      height: 2.5rem;

      &:nth-child(2) {
        width: 3.5rem;
      }
    }

    @include smallestPhones {
      &:first-child {
        display: none;
      }

      &:nth-child(2) {
        margin-left: $smaller;
      }

      &:last-child {
        display: none;
      }
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

    @media only screen and (max-width: 1080px) {
      width: 20rem !important;
    }

    @include allPhones {
      width: 100% !important;
      margin: 4px -16px;
      user-select: none;
      pointer-events: none;

      > #progress {
        height: 1px !important;
        width: 100vw !important;
        margin: unset;
      }
    }

    .time {
      font-weight: 500;
      font-size: $medium;

      .numbers {
        background-color: $gray3;
        border-radius: $smaller;
        padding: 1px $smaller;
        font-variant-numeric: tabular-nums;
      }
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
