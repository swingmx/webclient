<template>
  <div class="radio-card rounded">
    <img
      :src="radio.image"
      :alt="`Image for ${radio.name}`"
      class="rounded-sm"
    />
    <div class="radio-card__info">
      <div class="r-name ellip" :title="radio.name">
        <b>{{ radio.name }}</b>
      </div>
      <div class="r-genres">{{ radio.genres.join(", ") }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Radio } from "@/interfaces";

defineProps<{
  radio: Radio;
}>();
</script>

<style lang="scss">
.radio-card {
  padding: $medium;
  height: max-content;

  &:hover {
    background-color: $gray;
  }

  img {
    width: 100%;
    margin-bottom: $smaller;
    aspect-ratio: 1;
    object-fit: cover;
  }

  .radio-card__info {
    display: flex;
    flex-direction: column;
    gap: $smaller;
  }

  .r-genres {
    font-size: 14px;
    color: #999;
  }
}
</style>
