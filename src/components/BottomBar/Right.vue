<template>
  <div class="right-group">
    <LyricsButton />
    <Volume />
    <button
      class="repeat"
      :class="{ 'repeat-disabled': settings.no_repeat }"
      :title="settings.repeat_all ? 'Repeat all' : settings.no_repeat ? 'No repeat' : 'Repeat one'"
      @click="settings.toggleRepeatMode"
    >
      <RepeatOneSvg v-if="settings.repeat_one" />
      <RepeatAllSvg v-else />
    </button>
    <button title="Shuffle" @click="queue.shuffleQueue">
      <ShuffleSvg />
    </button>
    <HeartSvg
      v-if="!hideHeart"
      title="Favorite"
      :state="queue.currenttrack?.is_favorite"
      @handleFav="() => $emit('handleFav')"
    />
  </div>
</template>

<script setup lang="ts">
import useQueue from "@/stores/queue";
import useSettings from "@/stores/settings";

import RepeatOneSvg from "@/assets/icons/repeat-one.svg";
import RepeatAllSvg from "@/assets/icons/repeat.svg";
import ShuffleSvg from "@/assets/icons/shuffle.svg";
import HeartSvg from "../shared/HeartSvg.vue";
import LyricsButton from "../shared/LyricsButton.vue";
import Volume from "./Volume.vue";

const queue = useQueue();
const settings = useSettings();

defineProps<{
  hideHeart?: boolean;
}>();

defineEmits<{
  (event: "handleFav"): void;
}>();
</script>

<style lang="scss">
.right-group {
  display: grid;
  justify-content: flex-end;
  grid-template-columns: repeat(5, max-content);
  align-items: center;
  height: 4rem;

  @include allPhones {
    width: max-content;
    height: unset;
  }

  button {
    height: 3rem !important;
    width: 3rem !important;
    background-color: transparent;
    border: solid 1px transparent;

    &:hover {
      border: solid 1px $gray3 !important;
      background-color: $gray !important;
    }
  }

  .lyrics,
  .repeat {
    svg {
      transform: scale(0.75);
    }
  }

  button.repeat.repeat-disabled {
    svg {
      opacity: 0.25;
    }
  }

  .heart-button {
    border: solid 1px $gray4 !important;
  }
}
</style>
