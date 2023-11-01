<template>
  <div class="nav-queue-title">
    <QueueActions :on-now-playing="true" />
  </div>
</template>

<script setup lang="ts">
import QueueActions from "@/components/RightSideBar/Queue/QueueActions.vue";
</script>

<style lang="scss">
.nav-queue-title {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;

  .queue-actions {
    margin: 0;
    width: 100%;
  }
}
</style>
