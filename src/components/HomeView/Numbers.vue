<template>
  <div class="home-count">
    <div class="count-item" :title="count.count.toLocaleString()" v-for="count in parseCount()" :key="count.text">
      <div>{{ count.formatted }}</div>
      <div class="text">{{ count.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  counts: { [key: string]: number }[];
}>();

function formatNumber(num: number) {
  if (num >= 1e6) {
    return [(num / 1e6).toFixed(1), "m"];
  } else if (num >= 1e3) {
    return [(num / 1e3).toFixed(1), "k"];
  } else {
    return [num.toString(), ""];
  }
}

function parseCount() {
  return props.counts.map((count) => {
    const num = count[Object.keys(count)[0]];
    const formatted = formatNumber(count[Object.keys(count)[0]]);

    return {
      count: num,
      formatted: formatted[0] + formatted[1],
      text: Object.keys(count)[0],
    };
  });
}
</script>

<style lang="scss">
.home-count {
  height: 100%;
  display: flex;
  gap: 1rem;

  .count-item {
    font-size: 3rem;
    font-weight: bolder;
    display: flex;
    flex-direction: column;
    border-right: solid 1px $gray5;
    padding-right: 1rem;

    .text {
      font-size: 1rem;
      font-weight: 400;
      text-transform: uppercase;
      margin-left: $smaller;
    }
  }
}
</style>
