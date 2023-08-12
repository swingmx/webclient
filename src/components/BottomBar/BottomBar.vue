<template>
  <div class="b-bar">
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

import HotKeys from "@/components/LeftSidebar/NP/HotKeys.vue";
import Progress from "@/components/LeftSidebar/NP/Progress.vue";
import Navigation from "@/components/LeftSidebar/NavButtons.vue";

import LeftGroup from "./Left.vue";
import RightGroup from "./Right.vue";

const queue = useQStore();

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
  padding: 0 1rem;

  @include allPhones {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
    padding: 0 1rem $small 1rem;

    .center > input {
      height: 2px !important;
    }
  }

  button {
    background: transparent;
    border-radius: $small;
    width: 3rem;

    &:hover {
      border: solid 1px $gray3 !important;
      background-color: $gray !important;
    }

    @include allPhones {
      height: 3rem;
    }
  }

  &:hover {
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
    margin-bottom: -$small;

    width: 30rem;

    @media (max-width: 1080px) {
      width: 20rem !important;
    }

    @include allPhones {
      width: 100% !important;
    }

    .time {
      font-size: $medium;
      height: fit-content;
      width: 3rem;

      span {
        background-color: $gray3;
        border-radius: $smaller;
        padding: 0 $smaller;
      }
    }

    .time-full {
      text-align: end;
    }
  }

  // hotkeys
  .buttons {
    display: grid;
    place-items: center;
    transform: scale(1.2);
    border: none;
  }
}
</style>
