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
    <img class="artist-image circular" :src="imguri + artist.image" />
    <div v-if="show_help" class="rhelp t-center">NEW MUSIC</div>
    <div class="artist-name t-center">
      {{ artist.name }}
    </div>
    <div class="racount t-center">
      {{ artist.trackcount }} Track{{ artist.trackcount == 1 ? "" : "s" }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Artist } from "@/interfaces";
import { Routes } from "@/router";
import { paths } from "../../config";

const imguri = paths.images.artist.large;

defineProps<{
  artist: Artist;
  show_help?: boolean;
}>();
</script>

<style lang="scss">
.artist-card {
  flex: 0 0 10.1rem;

  overflow: hidden;
  position: relative;

  border-radius: $medium;
  justify-content: center;
  padding: 1.2rem 1rem !important;
  font-size: 0.9rem;
  font-weight: bolder;
  height: max-content;

  &:hover {
    background-color: $gray4;
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
