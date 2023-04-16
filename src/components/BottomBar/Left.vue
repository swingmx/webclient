<template>
  <div class="left-group" v-auto-animate>
    <HeartSvg
      v-if="settings.use_np_img"
      :state="queue.currenttrack?.is_favorite"
      @handleFav="emit('handleFav')"
    />
    <RouterLink
      v-else
      title="go to album"
      :to="{
        name: Routes.album,
        params: {
          hash: queue.currenttrack?.albumhash || ' ',
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
      <ArtistName
        :artists="queue.currenttrack?.artist || []"
        :albumartists="
          queue.currenttrack?.albumartist || 'Welcome to Swing Music'
        "
        class="artist"
      />
      <div v-tooltip class="title">
        <span class="ellip">
          {{ queue.currenttrack?.title || "Hello there" }}
        </span>
        <MasterFlag :bitrate="queue.currenttrack?.bitrate || 0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { paths } from "@/config";
import ArtistName from "@/components/shared/ArtistName.vue";
import { getShift } from "@/utils/colortools/shift";
import useColorStore from "@/stores/colors";

import useSettingsStore from "@/stores/settings";
import useQStore from "@/stores/queue";
import HeartSvg from "../shared/HeartSvg.vue";
import MasterFlag from "../shared/MasterFlag.vue";

const queue = useQStore();
const settings = useSettingsStore();
const colors = useColorStore();

const emit = defineEmits<{
  (e: "handleFav"): void;
}>();
</script>

<style lang="scss">
.left-group {
  display: grid;
  padding-left: 1rem;
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
}
</style>
