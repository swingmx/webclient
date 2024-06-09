<template>
  <RouterLink
    :to="{
      name: res_type === 'artist' ? Routes.artist : Routes.album,
      params: res_type === 'artist' ? { hash: item.artisthash || ' ' } : { albumhash: item.albumhash || ' ' },
    }"
    class="top-result-item rounded"
  >
    <img
      :src="res_type === 'artist' ? paths.images.artist.medium + item.image : paths.images.thumb.medium + item.image"
      alt=""
      class="rounded-sm"
      :class="{ circular: res_type === 'artist' }"
    />
    <div class="info" :class="{ 'is-artist': res_type === 'artist' }">
      <div class="type pad-sm rounded">{{ res_type }}</div>
      <div>
        <h3>
          {{ res_type === "artist" ? item.name : item.title }}
        </h3>
        <div v-if="res_type === 'album'" class="artists flex">
          <span> {{ item.date }}</span> &nbsp; • &nbsp;
          <ArtistName :artists="item.albumartists" :albumartists="''" />
        </div>
        <div v-if="res_type === 'artist'" class="artists flex">
          {{ item.albumcount }}
          {{ item.albumcount === 1 ? "album" : "albums" }} •
          {{ item.trackcount }}
          {{ item.trackcount === 1 ? "track" : "tracks" }}
        </div>
        <div v-if="res_type === 'track'" class="artists flex">
          <ArtistName :artists="item.artists" :albumartists="item.albumartists" />
          &nbsp; • &nbsp;
          {{ formatSeconds(item.duration, true) }}
        </div>
      </div>
    </div>
    <div class="buttons">
      <span v-if="res_type !== 'track'"></span>
      <button
        v-if="res_type === 'track'"
        :class="{ context_menu_showing }"
        class="context-menu-button"
        @click.prevent="showMenu"
      >
        <Moresvg />
      </button>
      <PlayBtn
        :source="
          res_type == 'album' ? playSources.album : res_type == 'artist' ? playSources.artist : playSources.track
        "
        :album-hash="item.albumhash"
        :album-name="item.title"
        :artisthash="item.artisthash"
        :artistname="item.name"
        :track="item"
      />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { showTrackContextMenu as showContext } from "@/helpers/contextMenuHandler";
import useSearchStore from "@/stores/search";

import Moresvg from "@/assets/icons/more.svg";
import ArtistName from "@/components/shared/ArtistName.vue";
import { paths } from "@/config";
import { Album, Artist, Track } from "@/interfaces";
import { formatSeconds } from "@/utils";

import PlayBtn from "@/components/shared/PlayBtn.vue";
import { playSources } from "@/enums";

const search = useSearchStore();

const { top_results } = storeToRefs(search);

const res_type = computed(() => {
  return top_results.value.top_result.type;
});

type It = Album & Artist & Track;

const item = computed(() => {
  return top_results.value.top_result.item as It;
});

const context_menu_showing = ref(false);

function showMenu(e: MouseEvent) {
  showContext(e, item.value as Track, context_menu_showing);
}
</script>

<style lang="scss">
.top-result-item {
  background-color: $gray5;
  padding: 1rem;
  display: grid;
  gap: 1rem;
  align-items: flex-end;
  margin: 1rem;
  margin-bottom: 2rem;
  position: relative;
  min-width: 22rem;
  max-width: 27rem;

  .buttons {
    position: absolute;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem $medium;

    .play-btn {
      width: 2.5rem;
      height: 2.5rem;
      opacity: 0;
      transition: opacity 0.2s ease-in-out, background-color 0.2s ease-out;
    }
  }

  &:hover {
    .play-btn {
      opacity: 1;
    }
  }

  .context-menu-button {
    transform: rotate(90deg);
    background-color: transparent;

    svg {
      transform: scale(1.2);
    }
  }

  .context_menu_showing {
    background-color: $darkestblue;
  }

  img {
    width: 7.5rem;
    height: 7.5rem;
    object-fit: cover;
  }

  .type {
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    background-color: $darkblue;
    width: max-content;
    padding: 2px $small;
    text-transform: capitalize;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0;

    .is-artist {
      text-transform: capitalize;
    }

    .artists {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.8;
    }

    h3 {
      margin-bottom: $small;
      margin-top: 1rem;
      font-size: 1.5rem;
    }
  }
  .is-artist {
    .artists {
      text-transform: capitalize;
      margin-bottom: 1rem;
    }

    h3 {
      margin-top: 0;
    }

    flex-direction: column-reverse;
  }
}
</style>
