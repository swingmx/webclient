<template>
  <div class="b-bar">
    <LeftGroup @handleFav="handleFav" />
    <div class="center">
      <div class="with-time">
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

    <div class="right-group">
      <HeartSvg
        :state="queue.currenttrack?.is_favorite"
        @handleFav="handleFav"
      />
      <button
        class="repeat"
        :class="{ 'repeat-disabled': settings.no_repeat }"
        @click="settings.toggleRepeatMode"
        :title="
          settings.repeat_all
            ? 'Repeat all'
            : settings.no_repeat
            ? 'No repeat'
            : 'Repeat one'
        "
      >
        <RepeatOneSvg v-if="settings.repeat_one" />
        <RepeatAllSvg v-else />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatSeconds } from "@/utils";
import { favType } from "@/composables/enums";
import favoriteHandler from "@/composables/favoriteHandler";

import useQStore from "@/stores/queue";
import useSettingsStore from "@/stores/settings";

import HotKeys from "@/components/LeftSidebar/NP/HotKeys.vue";
import Progress from "@/components/LeftSidebar/NP/Progress.vue";

import HeartSvg from "../shared/HeartSvg.vue";
import RepeatAllSvg from "@/assets/icons/repeat.svg";
import RepeatOneSvg from "@/assets/icons/repeat-one.svg";
import LeftGroup from "./Left.vue";

const queue = useQStore();
const settings = useSettingsStore();

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

  gap: 1rem;

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

.right-group {
  display: grid;
  justify-content: flex-end;
  grid-template-columns: repeat(2, max-content);
  align-items: center;
  height: 4rem;
  padding-right: 2rem;

  button {
    padding: 0;
    height: 3rem;
    width: 3rem;
    border: none;
  }

  button.repeat {
    background-color: transparent;

    svg {
      transform: scale(0.75);
    }
  }

  button.repeat.repeat-disabled {
    svg {
      opacity: 0.25;
    }
  }
}
</style>
