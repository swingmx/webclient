<template>
  <div class="album-buttons">
    <PlayBtnRect :source="playSources.album" :bg_color="colors.btn" />

    <HeartSvg
      :state="album.is_favorite"
      :color="colors.bg ? colors.bg : ''"
      @handleFav="handleFav"
    />
    <button
      class="options"
      :class="{ context_menu_showing }"
      @click.prevent="showContextMenu"
    >
      <MoreSvg
        :style="{
          color: textColor,
        }"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";

import { favType, playSources } from "@/enums";
import useAlbumStore from "@/stores/pages/album";

import MoreSvg from "@/assets/icons/more.svg";
import HeartSvg from "@/components/shared/HeartSvg.vue";
import PlayBtnRect from "@/components/shared/PlayBtnRect.vue";
import favoriteHandler from "@/helpers/favoriteHandler";
import { showAlbumContextMenu } from "@/helpers/contextMenuHandler";

const store = useAlbumStore();
const { info: album, colors } = storeToRefs(store);

defineProps<{
  textColor: string;
}>();

const context_menu_showing = ref(false);

function showContextMenu(e: MouseEvent) {
  showAlbumContextMenu(e, context_menu_showing);
}

function handleFav() {
  favoriteHandler(
    album.value.is_favorite,
    favType.album,
    album.value.albumhash,
    store.makeFavorite,
    store.removeFavorite
  );
}
</script>

<style lang="scss">
.album-buttons {
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
