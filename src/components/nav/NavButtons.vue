<template>
  <div id="back-forward" class="">
    <button class="back" @click="$router.back()">
      <ArrowSvg />
    </button>
    <button class="forward" @click="$router.forward()">
      <ArrowSvg />
    </button>
  </div>
</template>

<script setup lang="ts">
import ArrowSvg from "../../assets/icons/right-arrow.svg";
</script>

<style lang="scss">
#back-forward {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-right: 1rem;
  border-right: 1px solid $gray5;
  height: max-content;

  & > * {
    width: 2.25rem;
    height: 2.25rem;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border-radius: 5rem;

    svg {
      transform: scale(1.12);
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.88);
      }
    }
  }

  .back {
    transform: rotate(180deg);
  }
}
</style>
