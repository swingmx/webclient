<template>
  <div
    class="artist-info"
    :style="{
      color: artist.colors[0] ? getTextColor(artist.colors[0]) : undefined,
    }"
  >
    <section class="text">
      <div class="card-title">Artist</div>
      <div class="artist-name ellip2">{{ artist.name }}</div>
      <div class="stats">
        {{ artist.trackcount }} Track{{
          `${artist.trackcount == 1 ? "" : "s"}`
        }}
        <span v-if="artist.albumcount">
          • {{ artist.albumcount }} Album{{
            `${artist.albumcount == 1 ? "" : "s"}`
          }}
        </span>
        •
        {{ formatSeconds(artist.duration, true) }}
      </div>
    </section>
    <Buttons />
  </div>
</template>

<script setup lang="ts">
import { getTextColor } from "@/utils/colortools/shift";

import formatSeconds from "@/utils/useFormatSeconds";
import Buttons from "./Buttons.vue";
import { Artist } from "@/interfaces";

defineProps<{
  artist: Artist;
}>();
</script>

<style lang="scss">
.artist-info {
  z-index: 1;
  padding: 1rem;
  padding-right: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  gap: 1rem;

  .text {
    display: flex;
    flex-direction: column;
    gap: $small;
  }

  .card-title {
    font-size: small;
    font-weight: 700;
  }

  .artist-name {
    font-size: 3.5rem;
    font-weight: bold;
    word-wrap: break-word;
  }

  .stats {
    font-size: small;
    font-weight: 700;
  }
}
</style>
