<template>
  <div class="artist-buttons">
    <PlayBtnRect :source="playSources.artist" :bg_color="artist.colors.btn" />
    <HeartSvg
      @handleFav="handleFav"
      :state="artist.info.is_favorite"
      :color="artist.info.colors[0] ? artist.info.colors[0] : ''"
    />
    <button
      class="options"
      @click="showContext"
      :class="{ context_menu_showing }"
    >
      <MoreSvg />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { favType, playSources } from "@/enums";
import favoriteHandler from "@/helpers/favoriteHandler";
import { showArtistContextMenu } from "@/helpers/contextMenuHandler";
import useArtistPageStore from "@/stores/pages/artist";

import MoreSvg from "@/assets/icons/more.svg";
import HeartSvg from "@/components/shared/HeartSvg.vue";
import PlayBtnRect from "@/components/shared/PlayBtnRect.vue";

const artist = useArtistPageStore();
const context_menu_showing = ref(false);

function handleFav() {
  favoriteHandler(
    artist.info.is_favorite,
    favType.artist,
    artist.info.artisthash,
    artist.makeFavorite,
    artist.removeFavorite
  );
}

function showContext(e: MouseEvent) {
  showArtistContextMenu(
    e,
    context_menu_showing,
    artist.info.artisthash,
    artist.info.name
  );
}
</script>

<style lang="scss">
.artist-buttons {
  display: flex;
  gap: $small;

  .options {
    background-color: transparent;
    border: none;

    &.context_menu_showing {
      background-color: $darkblue;

      svg {
        color: $white !important;
      }
    }

    svg {
      transform: scale(1.25);
    }
  }
}
</style>
