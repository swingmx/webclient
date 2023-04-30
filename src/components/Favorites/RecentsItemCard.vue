<template>
  <RouterLink
    class="recent-fav-item rounded"
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
    <img
      :src="
        fav.type === 'album'
          ? paths.images.thumb.large + fav.item.image
          : fav.type === 'track'
          ? paths.images.thumb.large + fav.item.image
          : paths.images.artist.large + fav.item.image
      "
      alt=""
      :class="`rounded-sm ${fav.type}`"
    />
    <div class="name ellip">
      {{ fav.type === "artist" ? fav.item.name : fav.item.title }}
    </div>
    <div class="label">{{ fav.type }}</div>
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
  padding: $medium;
  height: 100%;
  display: grid;
  gap: $small;
  height: max-content;
  border: solid 1px transparent;

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

  .artist {
    border-radius: 50%;
  }
}
</style>
