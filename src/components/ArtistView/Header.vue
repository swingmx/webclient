<template>
  <div
    class="artist-header-ambient rounded"
    style="height: 100%; width: 100%"
    :style="{
      boxShadow: artist.info.colors.length
        ? `0 .5rem 2rem ${artist.info.colors[0]}`
        : undefined,
    }"
  ></div>
  <div
    class="artist-page-header rounded no-scroll"
    :style="{
      height: `${heightLarge || isSmallPhone ? '25rem' : '18rem'}`,
    }"
  >
    <Info />
    <div
      class="artist-img no-select"
      :style="{
        height: `${heightLarge ? '24rem' : '18rem'}`,
      }"
    >
      <img :src="paths.images.artist.large + artist.info.image" />
    </div>
    <div
      class="gradient"
      :style="{
        backgroundImage: artist.info.colors[0]
          ? `linear-gradient(${
              isSmallPhone ? '210deg' : 'to left'
            }, transparent 20%,
      ${artist.info.colors[0]} ${isSmallPhone ? '80' : '50'}%,
      ${artist.info.colors[0]} 100%)`
          : '',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import { paths } from "@/config";
import useArtistPageStore from "@/stores/pages/artist";
import updatePageTitle from "@/utils/updatePageTitle";
import { heightLarge, isSmallPhone } from "@/stores/content-width";

import Info from "./HeaderComponents/Info.vue";

const artist = useArtistPageStore();

const updateTitle = () => updatePageTitle(artist.info.name);
onMounted(() => updateTitle());
onBeforeRouteUpdate(() => updateTitle());
</script>

<style lang="scss">
.artist-header-ambient {
  height: 17rem;
  position: absolute;
  opacity: 0.25;
  margin-right: -1rem;
}

.artist-page-header {
  display: grid;
  grid-template-columns: 1fr minmax(min-content, 50%);
  position: relative;

  .artist-img {
    img {
      height: 100%;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      object-position: 0% 20%;
    }
  }

  .gradient {
    position: absolute;
    background-image: linear-gradient(
      to left,
      transparent 10%,
      $gray 50%,
      $gray 100%
    );
    height: 100%;
    width: 100%;

    @include smallPhone {
      background-image: linear-gradient(
        210deg,
        transparent 20%,
        $gray 80%,
        $gray 100%
      );
    }
  }

  @include smallPhone {
    display: flex;
    flex-direction: column-reverse;
    position: relative;

    .artist-img {
      position: absolute;
      width: 100%;
      top: 0;
      height: 100% !important;

      img {
        height: 100%;
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        object-position: 0% 20%;
      }
    }
  }
}
</style>
