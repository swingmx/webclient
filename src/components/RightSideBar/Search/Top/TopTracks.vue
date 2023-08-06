<template>
  <div class="right-search-top-tracks">
    <TrackItem
      v-for="(track, index) in search.top_results.tracks"
      :key="track.id"
      :track="track"
      :index="index"
      :is-current="false"
      :is-current-playing="false"
    />
  </div>
</template>

<script setup lang="ts">
import useSearchStore from "@/stores/search";
import TrackItem from "@/components/shared/TrackItem.vue";

const search = useSearchStore();
</script>

<style lang="scss">
.right-search-top-tracks {
  margin-bottom: 2rem;

  .track-item {
    padding: $small 1.1rem;
  }
}
</style>
