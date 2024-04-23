<template>
  <RouterLink
    class="recent-fav-item rounded"
    :class="fav.type"
    :to="{
      name: fav.type === 'album' ? Routes.album : Routes.artist,
      params: fav.type === 'album' ? { albumhash: fav.item.albumhash } : { hash: fav.item.artisthash },
    }"
  >
    <div class="imagegroup">
      <img
        :src="
          fav.type === 'album' ? paths.images.thumb.large + fav.item.image : paths.images.artist.large + fav.item.image
        "
        alt=""
        class="rounded-sm"
      />
    </div>
    <div class="name ellip" :title="fav.type === 'artist' ? fav.item.name : fav.item.title">
      {{ fav.type === "artist" ? fav.item.name : fav.item.title }}
    </div>
    <div class="label ellip" :class="{ on_artist: fav.type === 'artist' }">
      {{ fav.type === "album" ? fav.item.artist : "Artist" }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RecentFavResult } from "@/interfaces";
import { Routes } from "@/router";
import { paths } from "../../config";

defineProps<{
  fav: RecentFavResult;
}>();
</script>

<style lang="scss">
.recent-fav-item {
  flex: 0 0 $cardwidth;

  padding: $medium;
  height: 100%;
  display: grid;
  gap: $small;
  height: max-content;

  .imagegroup {
    position: relative;
    display: flex;
  }

  &:hover {
    background-color: $gray5;
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
    font-weight: 700;
    border-radius: 1rem;
    text-transform: capitalize;
    margin-top: -$smaller;
  }

  .on_artist {
    background-color: $gray5;
    padding: 0.1rem $small;
    color: $white;
  }

  &.artist {
    img {
      border-radius: 50%;
    }

    .name {
      margin: 0 auto;
      width: 100%;
      text-align: center;
    }

    .label {
      margin: 0 auto;
      width: max-content;
    }
  }
}
</style>
