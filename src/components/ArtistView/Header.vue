<template>
  <div
    v-if="!on_sidebar"
    class="artist-header-ambient rounded-lg"
    :class="{ isSmallPhone }"
    style="height: 100%; width: 100%"
    :style="{
      boxShadow: !useCircularImage
        ? colors.bg.length
          ? `0 .5rem 2rem ${colors.bg}`
          : undefined
        : undefined,
    }"
  ></div>
  <div
    ref="artistheader"
    class="artist-page-header rounded-lg no-scroll"
    :class="{ isSmallPhone, useCircularImage }"
    :style="{
      height: `${isSmallPhone ? '25rem' : containerHeight}`,
    }"
  >
    <Info :artist="artist" :use-circular-image="useCircularImage" />
    <div
      class="artist-img no-select"
      :style="{
        height: containerHeight,
      }"
    >
      <img
        id="artist-avatar"
        :src="paths.images.artist.large + artist.image"
        @load="store.setBgColor"
      />
    </div>
    <div
      v-if="!useCircularImage"
      class="gradient"
      :style="{
        backgroundImage: colors.bg
          ? `linear-gradient(${gradientDirection}, transparent 20%,
      ${colors.bg} ${gradientWidth}%,
      ${colors.bg} 100%)`
          : '',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useElementSize } from "@vueuse/core";
import useSettingsStore from "@/stores/settings";

import { paths } from "@/config";
import updatePageTitle from "@/utils/updatePageTitle";

import Info from "./HeaderComponents/Info.vue";
import useArtistStore from "@/stores/pages/artist";
import { getShift } from "@/utils/colortools/shift";

const store = useArtistStore();
const settings = useSettingsStore();

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
const useCircularImage = computed(
  () =>
    !isSmallPhone.value && (settings.useCircularArtistImg || width.value >= 995)
);

const gradientDirection = computed(() =>
  isSmallPhone.value ? "210deg" : "to left"
);

const gradientWidth = computed(() => {
  return isSmallPhone.value ? "80" : "50";
});

const containerHeight = computed(() => {
  return useCircularImage.value ? "13rem" : "18rem";
});
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
    display: flex;
    align-items: flex-end;
    order: 1;

    img {
      height: 100%;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      object-position: 0% 20%;
      float: right;
    }
  }

  &.useCircularImage {
    grid-template-columns: min-content 1fr;

    .artist-img {
      padding: 1rem;
      order: -1;
      z-index: 10;

      img {
        border-radius: 50%;
        height: calc(100% - 0rem);
        width: unset;
        aspect-ratio: 1;
      }
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
