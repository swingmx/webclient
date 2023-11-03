<template>
  <div v-auto-animate class="left-group">
    <HeartSvg
      v-if="settings.use_np_img && !isMobile"
      :state="queue.currenttrack?.is_favorite"
      @handleFav="$emit('handleFav')"
    />
    <RouterLink
      v-else
      title="Go to Now Playing"
      :to="{
        name: Routes.nowPlaying,
        params: {
          tab: 'home',
        },
      }"
    >
      <img
        class="rounded-sm"
        :src="paths.images.thumb.small + queue.currenttrack?.image"
        alt=""
      />
    </RouterLink>
    <div
      class="track-info"
      :style="{
        color: getShift(colors.theme1, [0, -170]),
      }"
    >
      <div v-tooltip class="title">
        <span class="ellip">
          {{ queue.currenttrack?.title || "Hello there" }}
        </span>
        <MasterFlag :bitrate="queue.currenttrack?.bitrate || 0" />
      </div>
      <ArtistName
        :artists="queue.currenttrack?.artists || []"
        :albumartists="
          queue.currenttrack?.albumartists || 'Welcome to Swing Music'
        "
        class="artist"
      />
    </div>
    <Actions v-if="isLargerMobile" @handleFav="$emit('handleFav')" />
    <HotKeys v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
import { paths } from "@/config";
import { Routes } from "@/router";
import { getShift } from "@/utils/colortools/shift";

import useQStore from "@/stores/queue";
import useColorStore from "@/stores/colors";
import useSettingsStore from "@/stores/settings";
import { isLargerMobile, isMobile } from "@/stores/content-width";

import Actions from "./Right.vue";
import HeartSvg from "../shared/HeartSvg.vue";
import MasterFlag from "../shared/MasterFlag.vue";
import HotKeys from "../LeftSidebar/NP/HotKeys.vue";
import ArtistName from "@/components/shared/ArtistName.vue";

const queue = useQStore();
const settings = useSettingsStore();
const colors = useColorStore();

defineEmits<{
  (e: "handleFav"): void;
}>();
</script>

<style lang="scss">
.left-group {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: $small;
  align-items: center;
  font-size: small;

  a {
    font-size: small;
  }

  img {
    height: 3rem;
  }

  .heart-button {
    height: 3rem;
    width: 3rem;
    border: solid 1px $gray4;
    padding: 0;
  }

  .track-info {
    .artistname {
      font-size: 0.9rem;
      opacity: 0.75;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .title {
      color: $white;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
  }
  @include allPhones {
    height: 4rem;
    grid-template-columns: max-content 1fr max-content;

    .heart-button {
      height: max-content;
      border: none !important;
    }
  }

  @media screen and (min-width: 550px) {
    grid-template-columns: max-content 1fr max-content max-content;
  }
}
</style>
