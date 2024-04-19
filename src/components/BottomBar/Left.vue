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
        replace: true,
      }"
      class="np-image rounded-sm no-scroll"
    >
      <img :src="paths.images.thumb.small + queue.currenttrack?.image" alt="" />
      <div class="expandicon">
        <ExpandSvg />
      </div>
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
        :albumartists="queue.currenttrack?.albumartists || 'Welcome to Swing Music'"
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

import useColorStore from "@/stores/colors";
import { isLargerMobile, isMobile } from "@/stores/content-width";
import useQStore from "@/stores/queue";
import useSettingsStore from "@/stores/settings";

import ExpandSvg from "@/assets/icons/expand.svg";
import ArtistName from "@/components/shared/ArtistName.vue";
import HotKeys from "../LeftSidebar/NP/HotKeys.vue";
import HeartSvg from "../shared/HeartSvg.vue";
import MasterFlag from "../shared/MasterFlag.vue";
import Actions from "./Right.vue";

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
  gap: $medium;
  align-items: center;
  font-size: small;

  .np-image {
    position: relative;
    height: 3rem;

    img {
      height: 100%;
    }

    .expandicon {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(51, 51, 51, 0.575);

      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.2s;

      svg {
        transform: rotate(-90deg);
      }
    }

    &:hover {
      .expandicon {
        transform: translateY(-$medium);
        height: 130%;
      }
    }
  }

  a {
    font-size: small;
  }

  .heart-button {
    height: 3rem;
    width: 3rem;
    border: solid 1px $gray4;
    padding: 0;
  }

  .track-info {
    .title {
      color: $white;
      font-weight: 600;
      display: flex;
      align-items: center;
    }

    .artistname {
      font-size: 0.9rem;
      opacity: 0.75;
      font-weight: 600;
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
