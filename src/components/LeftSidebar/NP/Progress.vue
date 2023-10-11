<template>
  <input
    id="progress"
    type="range"
    :value="time.current"
    min="0"
    :max="time.full"
    step="0.1"
    :style="{
      backgroundSize: `${
        (time.current / (time.full || 0)) * 100
      }% 100%`,
    }"
    @change="seek"
  />
</template>

<script setup lang="ts">
import useQStore from "@/stores/queue";

const q = useQStore();

const { duration: time } = q;

const seek = (e: Event) => {
  const elem = e.target as HTMLInputElement;
  const value = elem.value;

  q.seek(value as unknown as number);
};
</script>
