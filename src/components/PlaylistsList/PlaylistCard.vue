<template>
  <router-link :to="{ name: 'PlaylistView', params: { pid: playlist.id } }" class="p-card rounded no-scroll">
    <div v-if="!playlist.has_image && playlist.images.length" class="image-grid rounded-sm no-scroll">
      <img v-for="(img, index) in playlist.images" :key="index" :src="paths.images.thumb.smallish + (img['image'] || img)" />
      <PlayBtn :source="playSources.playlist" :playlist="playlist.id.toString()"/>
    </div>
    <div v-else class="image">
      <img :src="imguri + playlist.thumb" class="rounded-sm" :class="{ border: !playlist.thumb }" />
      <PlayBtn :source="playSources.playlist" :playlist="playlist.id.toString()"/>
    </div>
    <div class="overlay rounded">
      <div v-if="playlist.help_text" class="rhelp playlist">
        <span class="help">{{ playlist.help_text }}</span>
        <span class="time">{{ playlist.time }}</span>
      </div>
      <div class="p-name ellip">{{ playlist.name }}</div>
      <div class="p-count">
        <b>{{ playlist.count.toLocaleString() + ` Track${playlist.count === 1 ? "" : "s"}` }}</b>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { paths } from "../../config";
import { Playlist } from "../../interfaces";
import { playSources } from '@/enums'
import PlayBtn from '../shared/PlayBtn.vue'

const imguri = paths.images.playlist;
defineProps<{
  playlist: Playlist;
}>();
</script>

<style lang="scss">
.p-card {
  background-color: #2c2c2e45;
  display: grid;
  grid-template-rows: 1fr max-content;
  padding: $medium;
  gap: $small;
  user-select: none;
  height: max-content;
  transition: background-color 0.2s ease-out;

  .image {
    position: relative;
  }

  .image-grid {
    display: grid;
    grid: repeat(2, 1fr) / repeat(2, 1fr);
    position: relative;
  }

  &:hover {
    background-color: $gray4 !important;
    background-blend-mode: screen;
  }

  $btnwidth: 4rem;

  .play-btn {
    opacity: 0;
    position: absolute;
    width: 4rem;
    bottom: $small;
    left: calc(50% - ($btnwidth / 2));
    transition: all 0.25s;
  }

  &:hover {
    background-color: $gray4;

    .play-btn {
      opacity: 1;
      transform: translateY(-0.75rem);
    }
  }

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    transition: all 0.5s ease;
  }

  .overlay {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: all 0.25s ease;

    .p-name {
      font-weight: 600;
    }

    .p-count {
      font-size: 0.75rem;
      color: #ffffffbf;
      margin-top: $smaller;
    }
  }
}
</style>
