<template>
  <div class="now-playing-header">
    <div class="centered">
      <PlayingFrom />
      <RouterLink
        :to="{
          name: Routes.album,
          params: {
            albumhash: queue.currenttrack?.albumhash || ' ',
          },
        }"
        title="Go to Album"
        class="np-image"
      >
        <img
          v-motion-fade
          class="rounded"
          :src="paths.images.thumb.original + queue.currenttrack?.image"
        />
      </RouterLink>
      <NowPlayingInfo @handle-fav="handleFav" />
      <Progress />
      <div class="below-progress">
        <div class="time">
          {{ formatSeconds(queue.duration.current) }}
        </div>
        <Buttons v-if="isSmallPhone" :hide-heart="true" @handleFav="() => {}" />
        <div class="time">
          {{ formatSeconds(queue.duration.full) }}
        </div>
      </div>
    </div>
    <h3 v-if="queue.currenttrack">Now Playing</h3>
    <SongItem
      v-if="queue.currenttrack"
      :track="queue.currenttrack"
      :index="queue.currentindex + 1"
      :source="dropSources.folder"
      :style="{
        backgroundColor: colors.theme1,
        color: getTextColor(colors.theme1),
      }"
      @play-this="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import { paths } from "@/config";
import { Routes } from "@/router";
import useQueueStore from "@/stores/queue";

import Progress from "@/components/LeftSidebar/NP/Progress.vue";
import { dropSources, favType } from "@/enums";
import favoriteHandler from "@/helpers/favoriteHandler";
import useColorStore from "@/stores/colors";
import { getTextColor } from "@/utils/colortools/shift";
import SongItem from "../shared/SongItem.vue";
import NowPlayingInfo from "./NowPlayingInfo.vue";
import PlayingFrom from "./PlayingFrom.vue";
import Buttons from "../BottomBar/Right.vue";
import { isSmallPhone } from "@/stores/content-width";
import { formatSeconds } from "@/utils";

const queue = useQueueStore();
const colors = useColorStore();

function handleFav() {
  favoriteHandler(
    queue.currenttrack?.is_favorite,
    favType.track,
    queue.currenttrack?.trackhash || "",
    () => null,
    () => null
  );
}
</script>

<style lang="scss">
.now-playing-header {
  padding-bottom: 1rem;
  position: relative;

  .below-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time {
      font-size: 12px;
      background-color: $gray3;
      padding: 0 $smaller;
      min-width: 2.5rem;
      text-align: center;
      border-radius: $smaller;
    }
  }

  .centered {
    margin: 0 auto;
    width: 26rem;
    max-width: 100%;
  }

  .np-image {
    position: relative;
    margin-bottom: 1rem;

    .bitrate {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
    }

    img {
      width: 100%;
      height: 100%;
      max-width: 30rem;
      aspect-ratio: 1;
      object-fit: cover;
    }
  }

  #progress {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-right: 0;

    &::-moz-range-thumb {
      height: 0.8rem;
    }

    &::-webkit-slider-thumb {
      height: 0.8rem;
    }

    &::-ms-thumb {
      height: 0.8rem;
    }
  }
}
</style>
