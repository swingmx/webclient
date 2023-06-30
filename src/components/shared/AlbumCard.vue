<template>
  <RouterLink
    :to="{
      name: 'AlbumView',
      params: { hash: album.albumhash },
    }"
    class="album-card"
  >
    <div class="with-img rounded-sm no-scroll">
      <div
        class="gradient"
        :style="{
          background: `linear-gradient(to top, ${album.colors[0]} 20%, transparent)`,
        }"
      ></div>
      <img class="shadow-lg" :src="imguri + album.image" alt="" />
      <PlayBtn
        :store="useAlbumStore"
        :source="playSources.album"
        :albumHash="album.albumhash"
        :albumName="album.title"
      />
    </div>
    <div>
      <h4 class="title ellip" v-tooltip>
        {{ album.title }}
      </h4>
      <div
        class="artist ellip"
        @click.prevent.stop="() => {}"
        v-if="!hide_artists"
      >
        <template v-if="show_date"> {{ album.date }} </template>
        <span
          v-if="
            show_date &&
            artist_page &&
            album.albumartists[0].artisthash != $route.params.hash
          "
        >
          •
        </span>
        <RouterLink
          v-if="
            !show_date ||
            (artist_page &&
              album.albumartists[0].artisthash != $route.params.hash)
          "
          :to="{
            name: Routes.artist,
            params: { hash: album.albumartists[0].artisthash },
          }"
        >
          {{ album.albumartists[0].name }}
        </RouterLink>
      </div>

      <div
        class="artist ellip"
        v-if="
          album.versions.length === 0 &&
          hide_artists &&
          $route.name === Routes.album
        "
      >
        {{ album.date }}
        {{
          album.albumartists.length > 1
            ? ` • ${album.albumartists[1].name}`
            : ""
        }}
      </div>

      <div class="versions" v-if="album.versions.length">
        <MasterFlag
          v-for="v in getVersions(
            album.versions,
            useAlbumStore().info.versions
          )"
          :bitrate="1200"
          :text="v"
          :key="v"
        />
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { paths } from "../../config";
import { Album } from "../../interfaces";
import PlayBtn from "./PlayBtn.vue";

import { playSources } from "@/composables/enums";
import { Routes } from "@/router";
import useAlbumStore from "@/stores/pages/album";
import MasterFlag from "./MasterFlag.vue";

const imguri = paths.images.thumb.large;
defineProps<{
  album: Album;
  show_date?: boolean;
  artist_page?: boolean;
  hide_artists?: boolean;
}>();

function getVersions(ver1: string[], ver2: string[] = []) {
  const diff = ver1.filter((x) => !ver2.includes(x));

  if (diff.length > 0) {
    return diff.slice(0, 1);
  }

  return ver1.slice(0, 1);
}
</script>

<style lang="scss">
.album-card {
  display: grid;
  gap: $small;
  padding: $medium;
  border-radius: 1rem;
  border: solid 1px transparent;
  height: max-content;

  .with-img {
    position: relative;

    img {
      display: block;
      height: 8.5rem;
      aspect-ratio: 1;
      object-fit: cover;
    }

    .gradient {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    &:hover {
      .play-btn {
        transform: translateY(0);
        opacity: 1;
      }

      img {
        border-radius: 0 0 $medium $medium;
      }

      .gradient {
        opacity: 1;
      }
    }
  }

  .play-btn {
    $btn-width: 4rem;
    position: absolute;
    bottom: 1rem;
    right: calc((100% - $btn-width) / 2);
    opacity: 0;
    transform: translateY(1rem);
    transition: all 0.25s;
    width: $btn-width;
  }

  &:hover {
    background-color: $gray4;
    border: solid 1px $gray5;
  }

  img {
    width: 100%;
    // height: 100%;
    aspect-ratio: 1;
  }

  h4 {
    margin: 0;
  }

  .title {
    margin-bottom: $smaller;
    font-size: 0.9rem;
    width: fit-content;
    position: relative;
  }

  .artist {
    font-size: 0.8rem;
    text-align: left;
    opacity: 0.75;
    font-weight: 700;

    a {
      cursor: pointer !important;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .versions {
    display: flex;
    gap: $smaller;
    margin-top: $small;
    margin-left: -$smaller;
  }
}
</style>
