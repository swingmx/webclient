<template>
  <RouterLink
    class="recent-fav-item rounded"
    :class="fav.type"
    :to="{
      name:
        fav.type === 'album'
          ? Routes.album
          : fav.type === 'artist'
          ? Routes.artist
          : undefined,
      params: {
        hash:
          fav.type === 'album'
            ? fav.item.albumhash
            : fav.type === 'artist'
            ? fav.item.artisthash
            : undefined,
      },
    }"
  >
    <div class="imagegroup">
      <div
        v-if="fav.type === 'album'"
        class="albumbar rounded-sm"
        style="background-image: url('/cd.texture.webp')"
      ></div>
      <img
        :src="
          fav.type === 'album'
            ? paths.images.thumb.large + fav.item.image
            : fav.type === 'track'
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
    <div class="label">{{ fav.type }}</div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RecentFavResult } from "@/interfaces";
import { paths } from "../../config";
import { Routes } from "@/router";

import { getShift } from "@/utils/colortools/shift";

defineProps<{
  fav: RecentFavResult;
}>();
</script>

<style lang="scss">
.recent-fav-item {
  padding: $medium;
  height: 100%;
  display: grid;
  gap: $small;
  height: max-content;
  border: solid 1px transparent;

  .album-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    // object-fit: cover;
    // border-radius: $small;
    // opacity: 0.5;
  }

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
    border: solid 1px;
    width: max-content;
    border-radius: 1rem;
    padding: 0 $small;
    text-transform: capitalize;
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
