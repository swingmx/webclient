<template>
  <div class="now-playing-info">
    <div class="text">
      <div class="title">{{ queue.currenttrack?.title || "Swing Music" }}</div>
      <ArtistName
        v-if="queue.currenttrack"
        :artists="queue.currenttrack?.artists || null"
        :albumartists="queue.currenttrack?.albumartists || ''"
      />
      <span v-else class="artist author">
        <a href="https://github.com/mungai-njoroge" target="_blank"
          >built by @mungai-njoroge ↗</a
        >
      </span>
    </div>
    <div class="actions">
      <HeartSvg
        :state="queue.currenttrack?.is_favorite"
        @handle-fav="$emit('handleFav', queue.currenttrackhash)"
      />
      <OptionSvg
        class="optionsvg"
        :class="{ context_menu_showing }"
        @click="showMenu"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

import ArtistName from "../shared/ArtistName.vue";
import HeartSvg from "../shared/HeartSvg.vue";

import useQueueStore from "@/stores/queue";
import OptionSvg from "@/assets/icons/more.svg";
import { showTrackContextMenu } from "@/helpers/contextMenuHandler";

const route = useRoute();
const context_menu_showing = ref(false);

const queue = useQueueStore();

defineEmits<{
  (e: "handleFav", trackhash: string): void;
}>();

function showMenu(e: MouseEvent) {
  if (!queue.currenttrack) return;

  showTrackContextMenu(
    e,
    queue.currenttrack,
    context_menu_showing,
    route,
    false
  );
}
</script>

<style lang="scss">
.now-playing-info {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;
  margin-top: 1rem;

  .artist {
    font-size: 0.8rem;
    color: $gray1;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    .optionsvg {
      transform: scale(1.5) rotate(90deg);
      border-radius: $small;

      &:hover {
        background-color: $gray3;
        cursor: pointer;
      }
    }

    svg.context_menu_showing {
      background-color: $gray3;
    }
  }

  .heart-button {
    background-color: $gray;

    &:hover {
      background-color: $gray4;
    }
  }

  .author {
    & > * {
      color: $gray1 !important;
    }
  }
}
</style>
