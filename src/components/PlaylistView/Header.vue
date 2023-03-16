<template>
  <div
    class="p-header image rounded no-scroll"
    ref="playlistheader"
    :style="[
      {
        background: info.has_image
          ? `url(${imguri + info.image})`
          : info.images.length > 2
          ? getBackgroundColor(info.images[2].color)
          : '',
        backgroundPosition: `center ${bannerPos}%`,
        height: `${heightLarge ? '24rem' : '18rem'}`,
      },
    ]"
    :class="{ border: !info.images.length }"
  >
    <div class="gradient" v-if="!(info.image as string).endsWith('None')"></div>
    <div class="playlist-banner-images" v-if="!info.has_image">
      <img
        v-for="(img, index) in info.images"
        :key="index"
        :src="paths.images.thumb.large + img.image"
        alt=""
        class="rounded-sm"
        :style="{
          boxShadow: `0 0 1rem ${
            !info.has_image && info.images.length > 2
              ? getShift(info.images[2].color, [40, 60])
              : ''
          }`,
        }"
      />
    </div>
    <div class="carddd">
      <div
        class="info"
        :style="{
          color:
            !info.has_image && info.images.length > 2
              ? getTextColor(info.images[2].color)
              : '',
        }"
      >
        <div class="btns">
          <PlayBtnRect :source="playSources.playlist" :store="usePStore" />
        </div>
        <div class="duration">
          {{ info.count + ` ${info.count == 1 ? "Track" : "Tracks"}` }}
          •
          {{ formatSeconds(info.duration, true) }}
        </div>
        <div class="title ellip">{{ info.name }}</div>
        <div class="type">Playlist</div>
      </div>
    </div>
    <div class="last-updated" :class="{ lightbg: !info.image }">
      <span class="status"
        >Last updated {{ info.last_updated }} &#160;|&#160;&#160;</span
      >
      <div class="edit" @click="editPlaylist">Edit&#160;&#160;</div>
      |
      <DeleteSvg class="edit" @click="deletePlaylist" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";

import useNavStore from "@/stores/nav";
import useModalStore from "@/stores/modal";
import usePStore from "@/stores/pages/playlist";
import { heightLarge } from "@/stores/content-width";

import { paths } from "@/config";
import { playSources } from "@/composables/enums";
import { formatSeconds, useVisibility } from "@/utils";

import PlayBtnRect from "../shared/PlayBtnRect.vue";
import DeleteSvg from "@/assets/icons/delete.svg";
import {
  getShift,
  getTextColor,
  getBackgroundColor,
} from "@/utils/colortools/shift";

const modal = useModalStore();
const nav = useNavStore();
const playlist = usePStore();

const imguri = paths.images.playlist;

const playlistheader = ref<HTMLElement | null>(null);
const { info, bannerPos } = storeToRefs(playlist);

useVisibility(playlistheader, nav.toggleShowPlay);

function editPlaylist() {
  modal.showEditPlaylistModal(info.value);
}

function deletePlaylist() {
  modal.showDeletePlaylistModal(parseInt(playlist.info.id));
}
</script>

<style lang="scss">
.p-header {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  background-color: $gray;
  background-position: center 50%;

  .gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $black;
    opacity: 0.5;
  }

  .playlist-banner-images {
    width: 21rem;
    position: absolute;
    right: 0;
    top: -10rem;
    rotate: -40deg;

    display: flex;
    flex-wrap: wrap;
    gap: $medium;
    transition: all 0.2s ease-in-out;

    img {
      height: 9rem;
      transition: all 0.2s ease-in-out;
    }
  }

  .last-updated {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    padding: $smaller $small;
    background-color: $body;
    color: rgb(255, 255, 255);
    font-size: 0.9rem;
    border-radius: $smaller;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.479);
    z-index: 12;

    display: flex;
    align-items: center;

    .edit {
      cursor: pointer;
      color: $brown;
    }

    svg {
      transform: scale(0.75);
      margin-bottom: -0.2rem;
      color: $red !important;
    }
  }

  .last-updated.lightbg {
    background-color: $gray2;
  }

  .carddd {
    width: 100%;
    padding: 1rem;
    display: grid;
    z-index: 10;

    .info {
      display: flex;
      flex-direction: column-reverse;
    }

    .type {
      font-size: small;
      font-weight: 700;
      // color: rgb(218, 218, 218);
      opacity: 0.85;
    }

    .title {
      font-size: 4rem;
      font-weight: 1000;
      cursor: text;
    }

    .info.is_light {
      color: $gray5;

      .type {
        color: $pink;
        // opacity: 0.5;
      }
    }

    .duration {
      font-size: 0.8rem;
      padding: $smaller;
      padding-left: 0;
      font-weight: 900;
      cursor: text;
      opacity: 0.85;
    }

    .btns {
      margin-top: $small;
      display: flex;
      gap: $small;
    }
  }
}

.p-header.border {
  border: solid 1px $gray4;
}
</style>
