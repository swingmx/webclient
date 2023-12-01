<template>
  <div class="trackcard rounded">
    <img class="rounded-sm" :src="paths.images.thumb.large + track.image" />
    <div class="tinfo">
      <div class="rhelp track">NEW TRACK</div>
      <div class="ttitle ellip">{{ track.title }}</div>
      <ArtistName :albumartists="track.albumartists" :artists="track.artists" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { paths } from "@/config";
import { Track } from "@/interfaces";
import ArtistName from "../shared/ArtistName.vue";

defineProps<{
  track: Track;
}>();
</script>

<style lang="scss">
.trackcard {
  padding: $medium;
  cursor: pointer;
  flex: 0 0 10.1rem;


  &:hover {
    background-color: $gray3;
  }

  img {
    width: 100%;
  }

  .artist {
    font-size: 14px;
    opacity: 0.86;
  }
}
</style>
