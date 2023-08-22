<template>
  <form class="playlist-modal" @submit="create">
    <label for="name">Playlist name</label>
    <br />
    <input
      id="modal-playlist-name-input"
      type="search"
      class="rounded-sm"
      name="name"
    />
    <br /><br />
    <button type="submit">Create</button>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import {
  saveAlbumAsPlaylist,
  saveArtistAsPlaylist,
  saveTrackAsPlaylist,
} from "@/requests/playlists";
import useQueueStore from "@/stores/queue";
import { NotifType, Notification } from "@/stores/notification";
import { createNewPlaylist, saveFolderAsPlaylist } from "@/requests/playlists";

const props = defineProps<{
  trackhash?: string;
  path?: string;
  playlist_name?: string;
  albumhash?: string;
  artisthash?: string;
  is_queue?: boolean;
}>();

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

  const createTrackPlaylist = () =>
    saveTrackAsPlaylist(name, props?.trackhash || "").then(() => {
      emit("hideModal");
    });

  const createEmptyPlaylist = () =>
    createNewPlaylist(name).then(() => {
      emit("hideModal");
    });

  const createFolderPlaylist = () => {
    saveFolderAsPlaylist(name, props.path as string).then(() => {
      emit("hideModal");
    });
  };

  const createAlbumPlaylist = () => {
    saveAlbumAsPlaylist(name, props.albumhash as string).then(() => {
      emit("hideModal");
    });
  };

  const createArtistPlaylist = () => {
    saveArtistAsPlaylist(name, props.artisthash as string).then(() => {
      emit("hideModal");
    });
  };

  const createQueuePlaylist = () => {
    const queue = useQueueStore();
    const trackhashes = queue.tracklist.map((track) => track.trackhash);
    const itemhash = trackhashes.join(",");

    saveTrackAsPlaylist(name, itemhash).then(() => {
      emit("hideModal");
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

  if (props.artisthash) {
    createArtistPlaylist();
    return;
  }

  if (props.trackhash) {
    createTrackPlaylist();
    return;
  }

  if (props.is_queue) {
    createQueuePlaylist();
    return;
  }

  createEmptyPlaylist();
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
  }
}
</style>
