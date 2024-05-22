<template>
  <div
    class="p-header image rounded-lg"
    :style="[
      {
        background: bg,
        backgroundPosition: `center ${info.settings.banner_pos}%`,
        height: `${isSmallPhone ? '24rem' : '18rem'}`,
      },
    ]"
    :class="{ 'use-sqr_img': useSqrImg }"
  >
  <div
    v-if="!info.has_image || info.settings.square_img"
    class="album-header-ambient rounded-lg"
    style="height: 100%; width: 100%"
    :style="{
      // hide shadow on small screen
      boxShadow: isSmallPhone ? '' : colors.bg ? `0 .5rem 2rem ${colors.bg}` : '0 .5rem 2rem black',
    }"
  ></div>
    <div
      v-if="Number.isInteger(info.id)"
      class="float"
      :style="{
        color: textColor,
      }"
      @click="pinPlaylist(info.id)"
    >
      <PinFillSvg v-if="info.pinned" />
      <PinSvg v-else />
    </div>

    <div v-if="!isSmallPhone && info.has_image" class="gradient rounded-lg"></div>
    <div v-if="info.has_image && useSqrImg" class="sqr_img">
      <img :src="(playlist.info.image as string)" class="rounded-sm" />
    </div>
    <BannerImages v-if="playlist.info.count && !info.has_image && useSqrImg" class="sqr_img rounded-sm" />
    <Info :text-color="textColor" :btn_color="colors.btn" />
    <LastUpdated />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { pinUnpinPlaylist } from "@/requests/playlists";
import { heightLarge, isSmallPhone } from "@/stores/content-width";
import usePStore from "@/stores/pages/playlist";
import { getTextColor } from "@/utils/colortools/shift";

import PinFillSvg from "@/assets/icons/pin.fill.svg";
import PinSvg from "@/assets/icons/pin.svg";
import BannerImages from "./Header/BannerImages.vue";
import Info from "./Header/Info.vue";
import LastUpdated from "./Header/LastUpdated.vue";

const playlist = usePStore();

const { info, colors } = storeToRefs(playlist);

const bg = computed(() => {
  // hide background on small screen
  if (isSmallPhone.value){
    return "";
  }

  if (playlist.info.has_image) {
    if (isSmallPhone.value || (!playlist.info.settings.square_img && !isSmallPhone.value)) {
      return `url(${info.value.image})`;
    }
  }

  return colors.value.bg ? colors.value.bg : "";
});

const useSqrImg = computed(() => !playlist.info.has_image || !bg.value.startsWith("url"));

const textColor = computed(() => {
  if (colors.value.bg !== "") {
    // @ts-ignore
    return getTextColor(colors.value.bg);
  }

  return "";
});

function pinPlaylist(pid: number) {
  pinUnpinPlaylist(pid).then((success) => {
    if (success) {
      playlist.info.pinned = !playlist.info.pinned;
    }
  });
}
</script>

<style lang="scss">
.p-header {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  background-position: center 50%;
  background-size: cover !important;
  padding-bottom: 1rem;

  .album-header-ambient {
    position: absolute;
    opacity: 0.25;
  }

  .float {
    position: absolute;
    top: 1rem;
    right: 1rem;
    transform: scale(0.75);
    z-index: 100;
    cursor: pointer;
  }

  &.use-sqr_img {
    grid-template-columns: max-content 1fr;
    align-items: flex-end;

    .title {
      font-size: 3.75rem !important;
    }

    @include largePhones {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      gap: 1rem;

      // take up the space left by the gradient element
      height: 25rem !important;


      .playlist-info {
        text-align: center;
        height: max-content;
      }

      .sqr_img {
        height: 12rem;
        width: 12rem;
        margin-top: 1rem;
        margin: 0 auto;
      }

      .title {
        font-size: 2rem !important;
      }
    }
  }

  .sqr_img {
    height: 16rem;
    width: 16rem;
    z-index: 100;
    margin-left: 1rem;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $black;
    opacity: 0.5;
  }

  @include largePhones {
    .title {
      font-size: 2.5rem !important;
    }
  }
}
</style>
