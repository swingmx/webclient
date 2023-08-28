<template>
  <div class="radiogroup">
    <h3>{{ heading }}</h3>
    <div class="tagline">{{ tagline }}</div>
    <div class="cards">
      <RadioCard v-for="r in radios" :key="r.name" :radio="r" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Radio } from "@/interfaces";
import RadioCard from "@/components/Radios/RadioCard.vue";

defineProps<{
  radios: Radio[];
  heading: string;
  tagline: string
}>();
</script>

<style lang="scss">
.radiogroup {
  margin-bottom: 4rem;
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 2rem 0;
  }

  h3 {
    margin-left: $small;
    margin-bottom: $small;
  }

  .tagline {
    margin-left: $small;
    font-size: 14px;
    margin-bottom: 1rem;
  }
}
</style>
