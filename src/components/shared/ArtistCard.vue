<template>
  <RouterLink
    :to="{
      name: Routes.artist,
      params: {
        hash: artist.artisthash,
      },
    }"
    class="artist-card"
  >
    <div class="image circular">
      <img class="artist-image circular" :src="imguri + artist.image" />
      <div
        class="overlay circular"
        :style="{
          background: `linear-gradient(to top, ${artist.colors[0]} 20%, transparent)`,
        }"
      ></div>
      <PlayBtn
        :artisthash="artist.artisthash"
        :artistname="artist.name"
        :source="playSources.artist"
      />
    </div>
    <div v-if="artist.help_text" class="rhelp t-center">
      {{ artist.help_text }}
    </div>
    <div class="artist-name t-center">
      {{ artist.name }}
    </div>
    <div v-if="artist.help_text && artist.trackcount" class="racount t-center">
      {{ artist.trackcount }} Track{{ artist.trackcount == 1 ? "" : "s" }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Artist } from "@/interfaces";
import { Routes } from "@/router";
import { paths } from "@/config";

import PlayBtn from "./PlayBtn.vue";
import { playSources } from "@/enums";

const imguri = paths.images.artist.large;

defineProps<{
  artist: Artist;
}>();
</script>

<style lang="scss">
.artist-card {
  overflow: hidden;
  position: relative;

  border-radius: $medium;
  justify-content: center;
  padding: 1.2rem 1rem !important;
  font-size: 0.9rem;
  font-weight: bolder;
  height: max-content;

  .image {
    position: relative;

    .overlay {
      position: absolute;
      width: 100%;
      height: calc(100% - $small + 1px);
      top: 0;
      opacity: 0;
    }
  }

  $btnwidth: 4rem;

  .play-btn {
    opacity: 0;
    position: absolute;
    width: 4rem;
    bottom: 0;
    left: calc(50% - ($btnwidth / 2));
    transition: all 0.25s;
  }

  &:hover {
    background-color: $gray4;

    .play-btn {
      opacity: 1;
      transform: translateY(-1.25rem);
    }

    .overlay {
      opacity: 1;
    }
  }

  .artist-image {
    width: 100%;
    transition: all 0.5s ease-in-out;
    object-fit: cover;
    margin-bottom: $smaller;
  }

  .artist-name {
    margin-bottom: $smaller;
    word-break: break-word;
  }

  .racount {
    font-size: 12px;
    color: #ffffffbf;
  }
}
</style>
