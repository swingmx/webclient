<template>
  <div class="r-home">
    <UpNext :track="queue.tracklist[queue.next]" :play-next="queue.playNext" />
    <!-- <Recommendations /> -->
  </div>
</template>

<script setup lang="ts">
import useQStore from "../../../stores/queue";
import UpNext from "../Queue/upNext.vue";
const queue = useQStore();
</script>

<style lang="scss">
.r-home {
  height: calc(100% - 1rem);
}
</style>
