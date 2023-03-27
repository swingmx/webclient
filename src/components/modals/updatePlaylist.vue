<template>
  <form
    @submit.prevent="update_playlist"
    id="playlist-update-modal"
    class="playlist-modal"
    enctype="multipart/form-data"
    autocomplete="off"
  >
    <label for="name">Playlist name</label>
    <br />
    <input
      type="search"
      class="rounded-sm"
      name="name"
      id="modal-playlist-name-input"
      v-model="pname"
      @keypress.enter="playlist.has_image && update_playlist"
    />
    <br />
    <input
      type="file"
      accept="image/*"
      name="image"
      id="update-pl-image-upload"
      style="display: none"
      @change="handleUpload"
      ref="dropZoneRef"
    />
    <div
      id="upload"
      class="boxed rounded-sm"
      @click="selectFiles"
      tabindex="0"
      @keydown.space.enter.stop="selectFiles"
    >
      <div>Click to upload cover image</div>
      <div
        id="update-pl-img-preview"
        class="image"
        :style="{
          backgroundImage: `url(${
            paths.images.playlist + props.playlist.image
          })`,
        }"
      />
    </div>
    <div
      class="boxed banner-position-adjust rounded-sm"
      v-if="playlist.has_image"
    >
      <div class="t-center">
        Adjust image position - {{ pStore.bannerPos }}%
      </div>
      <div class="buttons">
        <div @click.prevent="pStore.minusBannerPos">
          <ExpandSvg />
        </div>
        <div @click.prevent="pStore.plusBannerPos">
          <ExpandSvg />
        </div>
      </div>
    </div>

    <button>
      {{ clicked ? "Updating" : "Update" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { updatePlaylist } from "@/composables/fetch/playlists";
import { paths } from "@/config";
import { Playlist } from "@/interfaces";
import usePStore from "@/stores/pages/playlist";

import ExpandSvg from "@/assets/icons/expand.svg";
const pStore = usePStore();

const props = defineProps<{
  playlist: Playlist;
}>();

const pname = ref(props.playlist.name);

onMounted(() => {
  (document.getElementById("modal-playlist-name-input") as HTMLElement).focus();
});

const emit = defineEmits<{
  (e: "setTitle", title: string): void;
  (e: "hideModal"): void;
}>();

emit("setTitle", "Update Playlist");

function selectFiles() {
  const input = document.getElementById(
    "update-pl-image-upload"
  ) as HTMLInputElement;
  input.click();
}

let image: File;

function handleUpload() {
  const input = document.getElementById(
    "update-pl-image-upload"
  ) as HTMLInputElement;

  if (input.files) {
    handleFile(input.files[0]);
  }
}

function handleFile(file: File) {
  if (!file || !file.type.startsWith("image/")) {
    return;
  }

  const preview = document.getElementById("update-pl-img-preview");
  const obj_url = URL.createObjectURL(file);

  if (preview) {
    preview.style.backgroundImage = `url(${obj_url})`;
  }

  image = file;
}

let clicked = ref(false);

function update_playlist(e: Event) {
  const form = document.getElementById(
    "playlist-update-modal"
  ) as HTMLFormElement;
  const formData = new FormData(form);

  const name = formData.get("name") as string;

  const nameChanged = name !== props.playlist.name;
  const imgChanged = image !== undefined;

  if (!nameChanged && !imgChanged) {
    emit("hideModal");
    return;
  }

  clicked.value = true;

  formData.append("image", image);

  if (name && name.toString().trim() !== "") {
    updatePlaylist(props.playlist.id, formData, pStore).then(() => {
      emit("hideModal");
    });
  }
}

// Future TODO: Implement drag and drop for images here
</script>

<style lang="scss">
#playlist-update-modal {
  input {
    height: 3rem !important;
  }
}
.playlist-modal {
  .boxed {
    border: solid 2px $gray3;
    color: $gray1;
    place-items: center;
    display: grid;
    grid-template-columns: 1fr max-content;
    margin-bottom: $small;
  }

  #upload {
    width: 100%;
    padding: $small;
    cursor: pointer;
    margin-bottom: 1rem;

    #update-pl-img-preview {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: $small;
      object-fit: cover;
      background-color: $gray4;
    }
  }

  .banner-position-adjust {
    gap: 1rem;
    padding: $small 1rem;
    margin-bottom: 1rem;

    .t-center {
      position: relative;
    }

    .buttons {
      display: grid;
      gap: $small;

      div {
        aspect-ratio: 1;
        height: 2rem;

        background-color: $gray4;
        border-radius: $small;
        display: grid;
        place-content: center;

        &:first-child {
          rotate: -90deg;
        }

        &:last-child {
          rotate: 90deg;
        }

        &:hover {
          background-color: $pink;
        }
      }
    }
  }
}
</style>
