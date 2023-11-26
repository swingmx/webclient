<template>
  <button
    v-wave
    class="playbtnrect shadow-sm circular btn-active"
    :style="{
      backgroundColor: bg_color ? bg_color : '',
      borderColor: bg_color ? bg_color : '',
      color: bg_color ? getShift(bg_color, [100, 100]) : '',
    }"
    @click="playFrom(source)"
  >
    <playBtnSvg />
    <div class="text">Play</div>
  </button>
</template>

<script setup lang="ts">
import { playSources } from "@/enums";
import { getShift } from "@/utils/colortools/shift";

import { playFrom } from "@/helpers/usePlayFrom";
import playBtnSvg from "@/assets/icons/play.svg";

defineProps<{
  source: playSources;
  bg_color?: string;
}>();
</script>

<style lang="scss">
.playbtnrect {
  width: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
}
</style>
