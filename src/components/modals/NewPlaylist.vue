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
    <button type="submit">CREATE</button>
  </form>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import usePlaylistStore from "@/stores/pages/playlists";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { createNewPlaylist } from "../../composables/fetch/playlists";
import { Track } from "../../interfaces";
import { Notification, NotifType } from "../../stores/notification";

const props = defineProps<{
  track?: Track;
}>();
const route = useRoute();
const playlistStore = usePlaylistStore();

onMounted(() => {
  (document.getElementById("modal-playlist-name-input") as HTMLElement).focus();
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

  if (name.trim()) {
    createNewPlaylist(name, props.track).then(({ success, playlist }) => {
      emit("hideModal");

      if (!success) return;

      if (route.name !== Routes.playlists) return;

      setTimeout(() => {
        playlistStore.addPlaylist(playlist);
      }, 600);
    });
  } else {
    new Notification("Playlist name can't be empty", NotifType.Error);
  }
}
</script>

<style lang="scss">
.playlist-modal {
  grid-gap: 1rem;
  margin-top: 1rem;

  label {
    font-size: 0.9rem;
    color: $gray1;
  }

  .submit {
    display: flex;
    justify-content: flex-end;
  }

  button {
    margin: 0 auto;
    width: 8rem;
    transition: all 0.25s ease-out;
  }
}
</style>
