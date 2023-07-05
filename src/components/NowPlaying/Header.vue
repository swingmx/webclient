<template>
  <div class="now-playing-header">
    <div class="centered">
      <div class="from">
        <img
          v-if="
            queue.from.type === FromOptions.album ||
            queue.from.type === FromOptions.artist
          "
          :src="image + '.webp'"
          :alt="`Now Playing ${queue.from.type} image`"
          :class="`${
            queue.from.type === FromOptions.artist ? 'circular' : 'rounded-sm'
          }`"
        />
        <div class="from-icon border rounded-sm" v-else>
          <component :is="icon"></component>
        </div>
        <router-link :to="(location as RouteLocationRaw)">
          <div class="pad-sm">
            <div class="type">{{ queue.from.type }}</div>
            <div class="ellip2">{{ name }}</div>
          </div>
        </router-link>
      </div>
      <div class="np-image">
        <img
          class="rounded"
          :src="paths.images.thumb.large + queue.currenttrack?.image"
        />
        <Bitrate />
      </div>
      <div class="info">
        <div class="text">
          <div class="title">{{ queue.currenttrack?.title }}</div>
          <ArtistName
            :albumartists="queue.currenttrack?.albumartist || []"
            :artists="queue.currenttrack?.artist || []"
          />
        </div>
        <div class="actions">
          <HeartSvg
            :state="queue.currenttrack?.is_favorite"
            @handle-fav="addToFav(queue.currenttrackhash)"
          />
        </div>
      </div>
      <Progress />
    </div>
    <h3 v-if="queue.currenttrack">[Image here] Now Playing</h3>
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
    <h3>Queue</h3>
  </div>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";

import { paths } from "@/config";
import useQueueStore from "@/stores/queue";
import playingFrom from "@/utils/playingFrom";

import HeartSvg from "../shared/HeartSvg.vue";
import ArtistName from "../shared/ArtistName.vue";
import favoriteHandler from "@/composables/favoriteHandler";
import { FromOptions, dropSources, favType } from "@/composables/enums";
import Progress from "@/components/NavBar/NP/Progress.vue";
import Bitrate from "../NavBar/NP/Bitrate.vue";
import SongItem from "../shared/SongItem.vue";
import useColorStore from "@/stores/colors";
import { getTextColor } from "@/utils/colortools/shift";

const queue = useQueueStore();
const colors = useColorStore();

function addToFav(trackhash: string) {
  favoriteHandler(
    queue.currenttrack?.is_favorite,
    favType.track,
    trackhash,
    () => null,
    () => null
  );
}

const { name, location, icon, image } = playingFrom(queue.from);
</script>

<style lang="scss">
.now-playing-header {
  padding-bottom: 1rem;

  .centered {
    margin: 0 auto;
    width: fit-content;
    max-width: 26rem;
  }

  .from {
    margin-bottom: 1rem;
    max-width: fit-content;
    display: flex;
    align-items: center;

    img {
      width: 2.5rem;
      aspect-ratio: 1;
      object-fit: cover;
    }

    .from-icon {
      padding: $smaller;
      aspect-ratio: 1;
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .type {
      text-transform: capitalize;
      font-size: 0.8rem;
      color: $gray1;
    }
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

  .info {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 1rem;

    .artist {
      font-size: 0.8rem;
      color: $gray1;
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
