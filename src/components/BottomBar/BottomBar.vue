<template>
  <div class="b-bar">
    <LeftGroup @handleFav="handleFav"/>
    <div class="center">
      <div class="with-time" v-if="!isMobile">
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
            {{
              formatSeconds(
                queue.currenttrack ? queue.currenttrack.duration : 0
              )
            }}
          </span>
        </div>
      </div>
      <Progress />
    </div>
    <RightGroup @handleFav="handleFav" v-if="!isMobile" />
    <Navigation v-else />
  </div>
</template>

<script setup lang="ts">
import { formatSeconds } from "@/utils";
import { favType } from "@/composables/enums";
import favoriteHandler from "@/composables/favoriteHandler";
import { isMobile } from "@/stores/content-width";

import useQStore from "@/stores/queue";

import HotKeys from "@/components/NavBar/NP/HotKeys.vue";
import Progress from "@/components/NavBar/NP/Progress.vue";
import Navigation from "@/components/NavBar/Navigation.vue";

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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
    padding: 0 1rem $small 1rem;
  }

  button {
    height: 2rem;
    width: 2rem;
    background: transparent;
    border-radius: $small;

    &:hover {
      border: solid 1px $gray3 !important;
      background-color: $gray !important;
    }
  }

  &:hover {
    ::-moz-range-thumb {
      height: 0.8rem;
    }

    ::-webkit-slider-thumb {
      height: 0.8rem;
    }

    ::-ms-thumb {
      height: 0.8rem;
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

    @media (max-width: 768px) {
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
    scale: 1.2;
    border: none;
  }
}
</style>
