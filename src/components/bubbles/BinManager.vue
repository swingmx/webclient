<template>
  <div id="bubble-manager" class="rounded">
    <DropArea />
  </div>
</template>

<script setup lang="ts">
import DropArea from "./DropArea.vue";
</script>

<style lang="scss">
#bubble-manager {
  position: fixed;
  bottom: 6rem;
  width: 15rem;
  background-color: $gray;
  padding: $small;

  left: 50%;
  transform: translateX(-50%);

  z-index: 100;
}
</style>
