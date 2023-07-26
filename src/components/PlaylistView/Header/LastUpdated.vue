<template>
  <div class="last-updated">
    <span class="status" v-if="!isSmallPhone"
      >Last updated {{ playlist.info.last_updated }} &#160;|&#160;&#160;</span
    >
    <div class="edit" @click="editPlaylist">Edit&#160;&#160;</div>
    |
    <DeleteSvg class="edit" @click="deletePlaylist" />
  </div>
</template>
<script setup lang="ts">
import DeleteSvg from "@/assets/icons/delete.svg";

import usePStore from "@/stores/pages/playlist";
import useModalStore from "@/stores/modal";
import { isSmallPhone } from "@/stores/content-width";

const playlist = usePStore();
const modal = useModalStore();

function editPlaylist() {
  modal.showEditPlaylistModal();
}

function deletePlaylist() {
  modal.showDeletePlaylistModal(playlist.info.id);
}
</script>

<style lang="scss">
.last-updated {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: $smaller $small;
  background-color: $body;
  color: rgb(255, 255, 255);
  font-size: 0.9rem;
  border-radius: $smaller;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.479);
  z-index: 12;

  display: flex;
  align-items: center;

  .edit {
    cursor: pointer;
    color: $brown;
  }

  svg {
    transform: scale(0.75);
    margin-bottom: -0.2rem;
    color: $red !important;
  }
}
</style>
