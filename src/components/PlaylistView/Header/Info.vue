<template>
  <div class="carddd">
    <div
      class="info"
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
        :class="`${playlist.info.sqr_img ? 'ellip2' : 'ellip'}`"
      >
        <WrapBalancer>{{ playlist.info.name }}</WrapBalancer>
      </div>
      <div class="type">Playlist</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { playSources } from "@/enums";
import { formatSeconds } from "@/utils";

import PlayBtnRect from "@/components/shared/PlayBtnRect.vue";
import usePStore from "@/stores/pages/playlist";

const playlist = usePStore();

defineProps<{
  textColor: string;
  btn_color?: string;
}>();
</script>
