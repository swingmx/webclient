<template>
  <div v-if="isSmall" class="playlists-nav">
    <div class="buttons">
      <button @click="showNewPlaylistModal()"><PlusSvg /> New Playlist</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlusSvg from "@/assets/icons/plus.svg";
import { isSmall } from "@/stores/content-width";

import useModalStore from "@/stores/modal";
const { showNewPlaylistModal } = useModalStore();
</script>

<style lang="scss">
.playlists-nav {
  display: flex;
  justify-content: flex-end;

  button {
    padding-right: $small;
  }
}
</style>
