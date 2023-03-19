<template>
  <div
    class="p-header image rounded no-scroll"
    :style="[
      {
        background: bg,
        backgroundPosition: `center ${bannerPos}%`,
        height: `${heightLarge ? '24rem' : '18rem'}`,
      },
    ]"
    :class="{ border: !info.images.length }"
  >
    <div class="gradient" v-if="!(info.image as string).endsWith('None')"></div>
    <BannerImages />
    <Info />
    <LastUpdated />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import usePStore from "@/stores/pages/playlist";
import { heightLarge } from "@/stores/content-width";

import { paths } from "@/config";
import BannerImages from "./Header/BannerImages.vue";

import Info from "./Header/Info.vue";
import { getBackgroundColor } from "@/utils/colortools/shift";
import LastUpdated from "./Header/LastUpdated.vue";

const playlist = usePStore();

const imguri = paths.images.playlist;

const { info, bannerPos } = storeToRefs(playlist);
const bg = ref("");

function getBg() {
  console.log("test");

  if (playlist.info.has_image) {
    return `url(${imguri + info.value.image})`;
  }

  if (info.value.images.length > 2) {
    return getBackgroundColor(info.value.images[2].color);
  }
}

onMounted(() => (bg.value = getBg()));
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
