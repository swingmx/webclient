<template>
  <div class="lockernumberinput">
    <button class="minus" @click="submit('minus')">-</button>
    <div class="number">{{ value }}{{ unit }}</div>
    <button class="plus" @click="submit('plus')">+</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}>();

function submit(action: "plus" | "minus") {
  const newValue = props.value + (action === "plus" ? props.step : -props.step);
  if (newValue < props.min || newValue > props.max) return;
  props.onChange(newValue);
}
</script>

<style lang="scss">
.lockernumberinput {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  .number {
    text-align: center;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  button {
    width: 2.25rem;
  }
}
</style>
