<template>
  <div class="tracktitle flex">
    <div class="thumbnail" @click.prevent="$emit('play')">
      <img :src="imguri + track.image" class="album-art image rounded-sm" />
      <div
        class="now-playing-track-indicator"
        :class="{ 'now-playing-track-indicator': is_current, last_played: !is_current_playing, active: is_current }"
      >
        <svg id="wave" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 30">
          <title>Audio Wave</title>
          <rect id="Line_1" x="1" y="11" width="2" height="8" rx="1" ry="1" />
          <rect id="Line_2" x="4" y="8" width="2" height="14" rx="1" ry="1" />
          <rect id="Line_3" x="7" y="4" width="2" height="22" rx="1" ry="1" />
          <rect id="Line_4" x="10" y="6" width="2" height="18" rx="1" ry="1" />
          <rect id="Line_5" x="13" y="11" width="2" height="8" rx="1" ry="1" />
          <rect id="Line_6" x="16" y="6" width="2" height="18" rx="1" ry="1" />
          <rect id="Line_7" x="19" y="4" width="2" height="22" rx="1" ry="1" />
          <rect id="Line_8" x="22" y="8" width="2" height="14" rx="1" ry="1" />
          <rect id="Line_9" x="25" y="11" width="2" height="8" rx="1" ry="1" />
        </svg>
      </div>
    </div>
    <div v-tooltip class="song-title">
      <div class="with-flag" @click.prevent="$emit('play')">
        <span class="title ellip">
          {{ track.title }}
        </span>
        <MasterFlag :bitrate="track.bitrate" />
      </div>
      <div class="isSmallArtists">
        <ArtistName :artists="track.artists" :albumartists="track.albumartists" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Track } from "@/interfaces";
const imguri = paths.images.thumb.small;

import ArtistName from "../ArtistName.vue";
import MasterFlag from "../MasterFlag.vue";

import { paths } from "@/config";

defineProps<{
  track: Track;
  is_current: boolean;
  is_current_playing: boolean;
}>();

defineEmits<{
  (e: "play"): void;
}>();
</script>

<style lang="scss">
.songlist-item > .tracktitle {
  position: relative;
  align-items: center;

  .thumbnail {
    margin-right: $medium;
    display: flex;

    .album-art {
      width: 3rem;
      height: 3rem;
      object-fit: contain;
      cursor: pointer;
      z-index: 20;
    }

    .now-playing-track-indicator {
      position: absolute;
      left: $small;
      top: $small;
      z-index: 20;
    }

    @include smallerPhones {
      margin-right: $small;
    }
  }

  .song-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: pointer;

    .with-flag {
      display: flex;
      align-items: center;
    }
  }
}
</style>
