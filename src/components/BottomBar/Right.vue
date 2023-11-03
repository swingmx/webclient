<template>
  <div class="right-group">
    <LyricsButton v-if="settings.use_lyrics_plugin || lyrics.exists" />
    <Volume />
    <button
      class="repeat"
      :class="{ 'repeat-disabled': settings.no_repeat }"
      :title="
        settings.repeat_all
          ? 'Repeat all'
          : settings.no_repeat
          ? 'No repeat'
          : 'Repeat one'
      "
      @click="settings.toggleRepeatMode"
    >
      <RepeatOneSvg v-if="settings.repeat_one" />
      <RepeatAllSvg v-else />
    </button>
    <HeartSvg
      v-if="!hideHeart"
      :state="queue.currenttrack?.is_favorite"
      @handleFav="() => $emit('handleFav')"
    />
  </div>
</template>

<script setup lang="ts">
import useQueue from "@/stores/queue";
import useSettings from "@/stores/settings";
import useLyrics from "@/stores/lyrics";

import HeartSvg from "../shared/HeartSvg.vue";
import RepeatAllSvg from "@/assets/icons/repeat.svg";
import RepeatOneSvg from "@/assets/icons/repeat-one.svg";
import Volume from "./Volume.vue";
import LyricsButton from "../shared/LyricsButton.vue";

const queue = useQueue();
const lyrics = useLyrics();
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
  grid-template-columns: repeat(4, max-content);
  align-items: center;
  height: 4rem;

  @include allPhones {
    width: max-content;
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
}
</style>
