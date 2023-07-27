<template>
  <div class="p-after-header">
    <div>Tracks</div>
  </div>
</template>

<script setup lang="ts">
import LastUpdated from "./Header/LastUpdated.vue";
</script>

<style lang="scss">
.p-after-header {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 1rem;

  font-size: 14px;
  color: $gray1;
}
</style>
