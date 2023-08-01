<template>
  <div
    class="playlist-info"
    :style="{
      color: textColor,
    }"
  >
    <div class="btns">
      <PlayBtnRect
        :source="playSources.playlist"
        :store="usePStore"
        :bg_color="btn_color"
      />
    </div>
    <div class="duration">
      {{
        playlist.info.count +
        ` ${playlist.info.count == 1 ? "Track" : "Tracks"}`
      }}
      •
      {{ formatSeconds(playlist.info.duration, true) }}
    </div>
    <div
      class="title"
      :class="`${
        playlist.info.settings.sqr_img && isSmall ? 'ellip' : 'ellip2'
      }`"
    >
      {{ playlist.info.name }}
    </div>
    <div class="type">Playlist</div>
  </div>
</template>
<script setup lang="ts">
import { playSources } from "@/enums";
import { formatSeconds } from "@/utils";
import { isSmall } from "@/stores/content-width";

import usePStore from "@/stores/pages/playlist";
import PlayBtnRect from "@/components/shared/PlayBtnRect.vue";

const playlist = usePStore();

defineProps<{
  textColor: string;
  btn_color?: string;
}>();
</script>

<style lang="scss">
.playlist-info {
  width: 100%;
  height: 100%;
  display: grid;
  z-index: 10;
  padding: 0 1rem 1rem 1rem;
  display: flex;
  flex-direction: column-reverse;

  .type {
    font-size: small;
    font-weight: 700;
    opacity: 0.85;
  }

  .title {
    font-size: 4rem;
    font-weight: 1000;
    cursor: text;
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
</style>
