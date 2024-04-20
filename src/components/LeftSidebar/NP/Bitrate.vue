<template>
  <div v-if="q.currenttrack?.bitrate" class="bitrate" title="file type • bitrate">
    {{ q.currenttrack.filepath?.split(".").pop() }} • {{ q.currenttrack.bitrate }}
  </div>
</template>

<script setup lang="ts">
import useQueueStore from "@/stores/queue";

const q = useQueueStore();
</script>

<style lang="scss">
.bitrate {
  position: absolute;
  font-size: 0.75rem;
  font-weight: 500;
  width: max-content;
  padding: 0.2rem 0.35rem;
  bottom: $medium;
  left: $small;
  background-color: $gray4;
  border-radius: $smaller;
  text-transform: uppercase;
}
</style>
