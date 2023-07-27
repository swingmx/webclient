<template>
  <div
    class="p-header image rounded"
    :style="[
      {
        background: bg,
        backgroundPosition: `center ${bannerPos}%`,
        height: `${heightLarge || isSmallPhone ? '24rem' : '18rem'}`,
      },
    ]"
    :class="{ 'use-sqr_img': info.sqr_img }"
  >
    <div class="gradient rounded" v-if="info.has_image"></div>
    <div
      class="album-header-ambient rounded"
      style="height: 100%; width: 100%"
      :style="{
        boxShadow: colors.bg
          ? `0 .5rem 2rem ${colors.bg}`
          : '0 .5rem 2rem black',
      }"
    ></div>
    <BannerImages />
    <div class="sqr_img" v-if="info.sqr_img">
      <img
        :src="paths.images.playlist + playlist.info.image"
        class="rounded-sm"
      />
    </div>
    <Info :textColor="textColor" :btn_color="colors.btn" />
    <LastUpdated />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { heightLarge, isSmallPhone } from "@/stores/content-width";
import usePStore from "@/stores/pages/playlist";

import { paths } from "@/config";
import BannerImages from "./Header/BannerImages.vue";

import { getBackgroundColor, getTextColor } from "@/utils/colortools/shift";
import Info from "./Header/Info.vue";
import LastUpdated from "./Header/LastUpdated.vue";

const playlist = usePStore();

const imguri = paths.images.playlist;

const { info, bannerPos, colors } = storeToRefs(playlist);
const bg = computed(() => {
  if (playlist.info.sqr_img) {
    return colors.value.bg ? colors.value.bg : "";
  }

  if (playlist.info.has_image) {
    return `url(${imguri + info.value.image})`;
  }

  if (info.value.images.length > 2) {
    // @ts-ignore
    return getBackgroundColor(info.value.images[2].color);
  }
});

const textColor = computed(() => {
  if (colors.value.bg !== "") {
    // @ts-ignore
    return getTextColor(colors.value.bg);
  }

  return "";
});
</script>

<style lang="scss">
.p-header {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  background-color: $gray;
  background-position: center 50%;
  background-size: cover !important;
  padding: 1rem;

  &.use-sqr_img {
    grid-template-columns: max-content 1fr;
    align-items: center;

    .title {
      font-size: 3.75rem !important;
    }
  }

  .sqr_img {
    height: 16rem;
    width: 16rem;
    z-index: 100;
    margin-right: 1rem;

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

  .carddd {
    width: 100%;
    height: 100%;
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
