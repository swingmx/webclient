<template>
  <div class="carddd">
    <div
      class="info"
      :style="{
        color:
          !playlist.info.has_image && playlist.info.images.length > 2
            ? getTextColor(playlist.info.images[2].color)
            : '',
      }"
    >
      <div class="btns">
        <PlayBtnRect :source="playSources.playlist" :store="usePStore" />
      </div>
      <div class="duration">
        {{
          playlist.info.count +
          ` ${playlist.info.count == 1 ? "Track" : "Tracks"}`
        }}
        •
        {{ formatSeconds(playlist.info.duration, true) }}
      </div>
      <div class="title ellip">{{ playlist.info.name }}</div>
      <div class="type">Playlist</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatSeconds, useVisibility } from "@/utils";
import { playSources } from "@/composables/enums";
import { getTextColor } from "@/utils/colortools/shift";

import PlayBtnRect from "@/components/shared/PlayBtnRect.vue";
import usePStore from "@/stores/pages/playlist";
const playlist = usePStore();

</script>
