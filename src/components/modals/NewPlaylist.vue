<template>
  <form @submit="create" class="playlist-modal">
    <label for="name">Playlist name</label>
    <br />
    <input
      type="search"
      class="rounded-sm"
      name="name"
      id="modal-playlist-name-input"
    />
    <br /><br />
    <button type="submit">Create</button>
  </form>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import { Track } from "@/interfaces";
import { saveAlbumAsPlaylist } from "@/requests/album";
import { createNewPlaylist, saveFolderAsPlaylist } from "@/requests/playlists";
import { NotifType, Notification } from "@/stores/notification";
import usePlaylistStore from "@/stores/pages/playlists";

const props = defineProps<{
  track?: Track;
  path?: string;
  playlist_name?: string;
  albumhash?: string;
}>();

const route = useRoute();
const playlistStore = usePlaylistStore();

onMounted(() => {
  const input_elem = document.getElementById(
    "modal-playlist-name-input"
  ) as HTMLInputElement;
  input_elem.focus();
  input_elem.value = props.playlist_name || "";
});

const emit = defineEmits<{
  (e: "setTitle", title: string): void;
  (e: "hideModal"): void;
}>();

emit("setTitle", "New Playlist");

/**
 * Create a new playlist. If this modal is called with a track,
 * add the track to the new playlist.
 * @param {Event} e
 */
function create(e: Event) {
  e.preventDefault();
  const name = (e.target as any).elements["name"].value;

  if (!name.trim()) {
    new Notification("Playlist name can't be empty", NotifType.Error);
    return;
  }

  const createNormalPlaylist = () =>
    createNewPlaylist(name, props.track).then(({ success, playlist }) => {
      emit("hideModal");

      if (!success) return;

      if (route.name !== Routes.playlists) return;

      setTimeout(() => {
        playlistStore.addPlaylist(playlist);
      }, 600);
    });

  const createFolderPlaylist = () => {
    saveFolderAsPlaylist(name, props.path as string).then((pid) => {
      emit("hideModal");
    });
  };

  const createAlbumPlaylist = () => {
    saveAlbumAsPlaylist(name, props.albumhash as string).then((pid) => {
      emit("hideModal");

      // if (route.name !== Routes.playlists) return;

      // setTimeout(() => {
      //   playlistStore.addPlaylist(playlist);
      // }, 600);
    });
  };

  if (props.path) {
    createFolderPlaylist();
    return;
  }

  if (props.albumhash) {
    createAlbumPlaylist();
    return;
  }

  createNormalPlaylist();
}
</script>

<style lang="scss">
.playlist-modal {
  grid-gap: 1rem;
  margin-top: 1rem;

  label {
    font-size: 0.9rem;
    color: $gray1;
    font-weight: 700;
  }

  .submit {
    display: flex;
    justify-content: flex-end;
  }

  button {
    margin: 0 auto;
    width: 8rem;
    transition: all 0.25s ease-out;
    background-color: $pink;
    border: solid 1px $pink;
  }
}
</style>
