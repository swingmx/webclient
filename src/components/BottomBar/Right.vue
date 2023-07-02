<template>
  <div class="right-group">
    <HeartSvg
      :state="queue.currenttrack?.is_favorite"
      @handleFav="() => emit('handleFav')"
      v-if="!hide_fav"
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

const queue = useQStore();
const settings = useSettingsStore();

// define emits: handleFav
const emit = defineEmits<{
  (event: "handleFav"): void;
}>();

defineProps<{
  hide_fav?: boolean;
}>();
</script>

<style lang="scss">
.right-group {
  display: grid;
  justify-content: flex-end;
  grid-template-columns: repeat(2, max-content);
  align-items: center;
  height: 4rem;

  @media screen and (max-width: 768px) {
    width: max-content;
  }

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
