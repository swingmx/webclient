<template>
  <button
    v-wave
    class="heart-button circular"
    @click="!no_emit && $emit('handleFav')"
    :style="{
      color: color ? getTextColor(color) : '',
      border: color ? `solid 1px ${getShift(color, [25, -25])}` : '',
    }"
  >
    <Motion
      :initial="{
        opacity: 0,
      }"
      :animate="{
        opacity: 1,
        transition: {
          delay: 0.25,
          duration: 0.5,
        },
      }"
    >
      <HeartFillSvg v-if="state" />
      <HeartSvg v-else />
    </Motion>
  </button>
</template>

<script setup lang="ts">
import HeartFillSvg from "@/assets/icons/heart.fill.svg";
import HeartSvg from "@/assets/icons/heart.svg";

import { getTextColor, getShift } from "@/utils/colortools/shift";

defineProps<{
  state: Boolean | undefined;
  no_emit?: Boolean;
  color?: string;
}>();

defineEmits<{
  (event: "handleFav"): void;
}>();
</script>

<style lang="scss">
$bg: rgb(250, 33, 33);

.heart-button {
  align-items: center;
  gap: $smaller;
  border: none;
  background: transparent;
  color: $bg;
  aspect-ratio: 1.5;

  div {
    height: max-content;
    scale: 1;

    svg {
      height: 1.5rem;
    }
  }

  &:hover {
    background: transparent;
    border: none;
  }
}
</style>
