<template>
  <RouterLink
    :to="{
      name: Routes.album,
      params: { albumhash: album.albumhash },
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
        :album-hash="album.albumhash"
        :album-name="album.title"
      />
    </div>
    <div>
      <div v-if="album.help_text" class="rhelp album">
        <span class="help">{{ album.help_text }}</span>
        <span class="time">{{ album.time }}</span>
      </div>
      <h4 v-tooltip class="title ellip">
        {{ album.title }}
      </h4>
      <div class="artist ellip" @click.prevent.stop="() => {}">
        <template v-if="show_date"> {{ album.date }} </template>
        <span v-if="show_date && artists.length > 0"> • </span>
        <RouterLink
          v-if="artists.length > 0"
          :to="{
            name: Routes.artist,
            params: { hash: artists[0].artisthash },
          }"
        >
          {{ `${artists[0].name}` }}
        </RouterLink>
      </div>
      <div v-if="album.versions.length" class="versions">
        <MasterFlag
          v-for="v in getVersions(album.versions, useAlbumStore().info.versions)"
          :key="v"
          :bitrate="1200"
          :text="v"
        />
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { Album } from "../../interfaces";
import PlayBtn from "./PlayBtn.vue";

import { playSources } from "@/enums";
import useAlbumStore from "@/stores/pages/album";
import { paths } from "../../config";
import MasterFlag from "./MasterFlag.vue";

const imguri = paths.images.thumb.medium;
const route = useRoute();

const props = defineProps<{
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

const artists = computed(() => {
  const albumartists = props.artist_page
    ? props.album.albumartists.filter((x) => x.artisthash != route.params.hash)
    : props.album.albumartists;

  return albumartists;
});
</script>

<style lang="scss">
.album-card {
  display: grid;
  gap: $small;
  padding: $medium;
  border-radius: 1rem;
  height: max-content;
  transition: background-color 0.2s ease-out;

  .with-img {
    position: relative;

    img {
      display: block;
      aspect-ratio: 1;
      height: 100%;
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
    background-color: $gray5;
  }

  img {
    width: 100%;
    aspect-ratio: 1;
  }

  h4 {
    margin: 0;
  }

  .title {
    margin-bottom: $smallest;
    font-size: 0.95rem;
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
