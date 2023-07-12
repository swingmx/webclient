<template>
  <RouterLink
    class="recent-fav-item rounded"
    :class="fav.type"
    :to="{
      name: fav.type === 'album' ? Routes.album : Routes.artist,
      params:
        fav.type === 'album'
          ? { albumhash: fav.item.albumhash }
          : { hash: fav.item.artisthash },
    }"
  >
    <div class="imagegroup">
      <div v-if="fav.type === 'album'" class="albumbar rounded-sm"></div>
      <img
        :src="
          fav.type === 'album'
            ? paths.images.thumb.large + fav.item.image
            : paths.images.artist.large + fav.item.image
        "
        alt=""
        class="rounded-sm"
      />
    </div>
    <div
      class="name ellip"
      :title="fav.type === 'artist' ? fav.item.name : fav.item.title"
    >
      {{ fav.type === "artist" ? fav.item.name : fav.item.title }}
    </div>
    <div class="label" :class="{ on_artist: fav.type === 'artist' }">
      {{ fav.type === "album" ? fav.item.artist : "Artist" }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RecentFavResult } from "@/interfaces";
import { paths } from "../../config";
import { Routes } from "@/router";

defineProps<{
  fav: RecentFavResult;
}>();
</script>

<style lang="scss">
.recent-fav-item {
  flex: 0 0 10.1rem;

  padding: $medium;
  height: 100%;
  display: grid;
  gap: $small;
  height: max-content;
  border: solid 1px transparent;

  .imagegroup {
    position: relative;
    display: flex;
  }

  .albumbar {
    width: 100%;
    height: 100%;
    position: absolute;
    // border-radius: $small 0 0 $small;

    background-size: 108% 108%;
    background-position: center;
    mix-blend-mode: screen;
    // background
  }

  &:hover {
    border-color: $gray3;
    background-color: $gray4;
  }

  img {
    width: 100%;
  }

  .name {
    font-size: 0.9rem;
  }

  .label {
    font-size: 0.8rem;
    color: $gray1;
    font-weight: bold;
    width: max-content;
    border-radius: 1rem;
    text-transform: capitalize;
    margin-top: -$smaller;
  }

  .on_artist {
    background-color: $gray3;
    padding: 0.1rem $small;
    // opacity: 0;
  }

  &.artist {
    img {
      border-radius: 50%;
    }

    .name {
      margin: 0 auto;
      width: max-content;
    }

    .label {
      margin: 0 auto;
    }
  }
}
</style>
