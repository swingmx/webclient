<template>
  <div
    class="p-header image rounded"
    :style="[
      {
        background: bg,
        backgroundPosition: `center ${info.settings.banner_pos}%`,
        height: `${heightLarge || isSmallPhone ? '24rem' : '18rem'}`,
      },
    ]"
    :class="{ 'use-sqr_img': info.has_image && info.settings.square_img }"
  >
    <div class="gradient rounded" v-if="info.has_image"></div>
    <div
      v-if="!info.has_image || info.settings.square_img"
      class="album-header-ambient rounded"
      style="height: 100%; width: 100%"
      :style="{
        boxShadow: colors.bg
          ? `0 .5rem 2rem ${colors.bg}`
          : '0 .5rem 2rem black',
      }"
    ></div>
    <div class="thumbnail-container rounded no-scroll">
      <BannerImages />
    </div>
    <div class="sqr_img" v-if="info.has_image && info.settings.square_img">
      <img :src="(playlist.info.image as string)" class="rounded-sm" />
    </div>
    <Info :textColor="textColor" :btn_color="colors.btn" />
    <LastUpdated />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";

import usePStore from "@/stores/pages/playlist";
import { getTextColor } from "@/utils/colortools/shift";
import { heightLarge, isSmallPhone } from "@/stores/content-width";

import Info from "./Header/Info.vue";
import LastUpdated from "./Header/LastUpdated.vue";
import BannerImages from "./Header/BannerImages.vue";

const playlist = usePStore();

const { info, colors } = storeToRefs(playlist);
const bg = computed(() => {
  if (playlist.info.has_image && !playlist.info.settings.square_img) {
    return `url(${info.value.image})`;
  }

  return colors.value.bg ? colors.value.bg : "";
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

  .thumbnail-container {
    height: 100% !important;
    position: absolute;
    width: 100%;
  }

  &.use-sqr_img {
    grid-template-columns: max-content 1fr;
    align-items: center;

    .title {
      font-size: 3.75rem !important;
    }

    @include smallPhone {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      gap: 1rem;

      .playlist-info {
        height: max-content;
      }

      .sqr_img {
        height: 13rem;
        width: 13rem;
        margin-top: 1rem;
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

  @include smallPhone {
  }
}

.p-header.border {
  border: solid 1px $gray4;
}
</style>
