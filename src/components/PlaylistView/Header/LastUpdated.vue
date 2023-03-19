<template>
  <div class="last-updated" :class="{ lightbg: !playlist.info.image }">
    <span class="status"
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

const playlist = usePStore();
const modal = useModalStore();

function editPlaylist() {
  modal.showEditPlaylistModal(playlist.info);
}

function deletePlaylist() {
  modal.showDeletePlaylistModal(parseInt(playlist.info.id));
}
</script>
