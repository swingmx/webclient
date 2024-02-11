<template>
  <input
    id="progress"
    type="range"
    :value="time.current"
    min="0"
    :max="time.full"
    step="0.1"
    :style="{
      backgroundSize: `${(time.current / (time.full || 0)) * 100}% 100%`,
    }"
    @change="seek"
  />
</template>

<script setup lang="ts">
import useQStore from "@/stores/queue";

const q = useQStore();

const { duration: time } = q;

let prevHash = "";

const seek = (e: Event) => {
  if (prevHash && prevHash !== q.currenttrackhash) {
    prevHash = "";
    return;
  }

  const elem = e.target as HTMLInputElement;
  const value = elem.value;

  prevHash = q.currenttrackhash;
  q.seek(value as unknown as number);
};
</script>
