<template>
  <div class="now-playing-header">
    <div class="centered">
      <PlayingFrom />
      <RouterLink
        :to="{
          name: Routes.album,
          params: {
            hash: queue.currenttrack?.albumhash || '',
          },
        }"
        title="Go to Album"
        class="np-image"
      >
        <img
          v-motion-fade
          class="rounded"
          :src="paths.images.thumb.original + queue.currenttrack?.image"
          @dblclick="handleFav(queue.currenttrack?.trackhash || '')"
        />
        <Bitrate />
      </RouterLink>
      <NowPlayingInfo @handle-fav="handleFav" />
      <Progress />
    </div>
    <h3 v-if="queue.currenttrack">Now Playing</h3>
    <SongItem
      v-if="queue.currenttrack"
      :track="queue.currenttrack"
      :index="queue.currentindex + 1"
      :source="dropSources.folder"
      @play-this="() => {}"
      :style="{
        backgroundColor: colors.theme1,
        color: getTextColor(colors.theme1),
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { paths } from "@/config";
import { Routes } from "@/router";
import useQueueStore from "@/stores/queue";

import { dropSources, favType } from "@/composables/enums";
import Progress from "@/components/NavBar/NP/Progress.vue";
import Bitrate from "../NavBar/NP/Bitrate.vue";
import SongItem from "../shared/SongItem.vue";
import useColorStore from "@/stores/colors";
import { getTextColor } from "@/utils/colortools/shift";
import PlayingFrom from "./PlayingFrom.vue";
import NowPlayingInfo from "./NowPlayingInfo.vue";
import favoriteHandler from "@/composables/favoriteHandler";

const queue = useQueueStore();
const colors = useColorStore();

function handleFav(trackhash: string) {
  favoriteHandler(
    queue.currenttrack?.is_favorite,
    favType.track,
    trackhash,
    () => null,
    () => null
  );
}
</script>

<style lang="scss">
.now-playing-header {
  padding-bottom: 1rem;

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
