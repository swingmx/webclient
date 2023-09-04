<template>
  <div
    v-if="!on_sidebar"
    class="artist-header-ambient rounded-lg"
    :class="{ isSmallPhone }"
    style="height: 100%; width: 100%"
    :style="{
      boxShadow: colors.bg.length ? `0 .5rem 2rem ${colors.bg}` : undefined,
    }"
  ></div>
  <div
    ref="artistheader"
    class="artist-page-header rounded-lg no-scroll"
    :class="{ isSmallPhone }"
    :style="{
      height: `${heightLarge || isSmallPhone ? '25rem' : '18rem'}`,
    }"
  >
    <Info :artist="artist" />
    <div
      class="artist-img no-select"
      :style="{
        height: `${heightLarge ? '24rem' : '18rem'}`,
      }"
    >
      <img
        id="artist-avatar"
        :src="paths.images.artist.large + artist.image"
        @load="store.setBgColor"
      />
    </div>
    <div
      class="gradient"
      :style="{
        backgroundImage: colors.bg
          ? `linear-gradient(${
              isSmallPhone ? '210deg' : 'to left'
            }, transparent 20%,
      ${colors.bg} ${isSmallPhone ? '80' : '50'}%,
      ${colors.bg} 100%)`
          : '',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useElementSize } from "@vueuse/core";

import { paths } from "@/config";
import updatePageTitle from "@/utils/updatePageTitle";
import { heightLarge } from "@/stores/content-width";

import Info from "./HeaderComponents/Info.vue";
import useArtistStore from "@/stores/pages/artist";
import { storeToRefs } from "pinia";

const store = useArtistStore();
const props = defineProps<{
  on_sidebar?: boolean;
}>();

const { info: artist, colors } = storeToRefs(store);

function updateTitle() {
  props.on_sidebar ? () => {} : updatePageTitle(artist.value.name);
}

onMounted(() => updateTitle());
onBeforeRouteUpdate(() => updateTitle());

const artistheader = ref(null);
const { width } = useElementSize(artistheader);

const isSmallPhone = computed(() => width.value <= 550);
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

    &.isSmallPhone {
      background-image: linear-gradient(
        210deg,
        transparent 20%,
        $gray 80%,
        $gray 100%
      );
    }
  }

  &.isSmallPhone {
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
