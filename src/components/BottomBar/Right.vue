<template>
  <div class="right-group">
    <Volume />
    <HeartSvg
      :state="queue.currenttrack?.is_favorite"
      @handleFav="() => $emit('handleFav')"
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
</template>

<script setup lang="ts">
import useQStore from "@/stores/queue";
import useSettingsStore from "@/stores/settings";

import HeartSvg from "../shared/HeartSvg.vue";
import RepeatAllSvg from "@/assets/icons/repeat.svg";
import RepeatOneSvg from "@/assets/icons/repeat-one.svg";
import Volume from "./Volume.vue";

const queue = useQStore();
const settings = useSettingsStore();

defineEmits<{
  (event: "handleFav"): void;
}>();
</script>

<style lang="scss">
.right-group {
  display: grid;
  justify-content: flex-end;
  grid-template-columns: repeat(3, max-content);
  align-items: center;
  height: 4rem;

  @include allPhones {
    width: max-content;
  }

  button {
    padding: 0;
    height: 3rem !important;
    width: 3rem !important;
    background-color: red;
    border: solid 1px transparent;
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
