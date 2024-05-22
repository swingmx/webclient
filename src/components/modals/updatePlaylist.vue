<template>
  <form
    id="playlist-update-modal"
    class="playlist-modal"
    enctype="multipart/form-data"
    autocomplete="off"
    @submit.prevent="update_playlist"
  >
    <label for="name">Playlist name</label>
    <input
      id="modal-playlist-name-input"
      v-model="pname"
      type="search"
      class="rounded-sm"
      name="name"
      spellcheck="false"
      @keypress.enter.prevent="update_playlist"
    />

    <label for="image">Image</label>
    <input
      id="update-pl-image-upload"
      ref="dropZoneRef"
      type="file"
      accept="image/*"
      name="image"
      style="display: none"
      @change="handleUpload"
    />
    <div id="upload" class="boxed rounded-sm">
      <div class="clickable" tabindex="0" @click="selectFiles" @keydown.space.enter.stop="selectFiles">
        <ImageIcon />
        Click to {{ playlist.has_image ? "update" : "upload" }} cover image
      </div>
      <div
        id="update-pl-img-preview"
        class="image"
        :style="{
          backgroundImage: `url(${playlist.image})`,
        }"
        tabindex="0"
      >
        <div v-if="!image && playlist.has_image" class="delete-icon" @click="pStore.removeBanner()">
          <DeleteIcon />
        </div>
      </div>
    </div>
    <label v-if="playlist.has_image && !playlist.settings.square_img">Settings</label>
    <div v-if="image || playlist.has_image" class="banner-settings rounded-sm">
      <div>Show square cover image</div>
      <Switch :state="playlist.settings.square_img || false" @click="pStore.toggleSquareImage" />
    </div>
    <div v-if="playlist.has_image && !playlist.settings.square_img" class="boxed banner-position-adjust rounded-sm">
      <div class="t-center">Adjust image position • {{ pStore.info.settings.banner_pos }}%</div>
      <div class="buttons">
        <button @click.stop.prevent="pStore.minusBannerPos">
          <ExpandSvg />
        </button>
        <button @click.stop.prevent="pStore.plusBannerPos">
          <ExpandSvg />
        </button>
      </div>
    </div>

    <button type="submit">
      {{ clicked ? "Saving" : "Update" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Ref, onMounted, ref } from "vue";

import { updatePlaylist } from "@/requests/playlists";
import usePStore from "@/stores/pages/playlist";

import DeleteIcon from "@/assets/icons/delete.svg";
import ExpandSvg from "@/assets/icons/expand.svg";
import ImageIcon from "@/assets/icons/image.svg";

import Switch from "../SettingsView/Components/Switch.vue";

const pStore = usePStore();
const { info: playlist } = storeToRefs(pStore);

const pname = ref(playlist.value.name);
const image: Ref<any> = ref(null);

onMounted(() => {
  (document.getElementById("modal-playlist-name-input") as HTMLElement).focus();
});

const emit = defineEmits<{
  (e: "setTitle", title: string): void;
  (e: "hideModal"): void;
}>();

emit("setTitle", "Update Playlist");

function selectFiles() {
  const input = document.getElementById("update-pl-image-upload") as HTMLInputElement;
  input.click();
}

function handleUpload() {
  const input = document.getElementById("update-pl-image-upload") as HTMLInputElement;

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
    pStore.setImage(obj_url);
    pStore.setInitialBannerPos();
  }

  image.value = file;
}

let clicked = ref(false);

function update_playlist(e: Event) {
  const form = document.getElementById("playlist-update-modal") as HTMLFormElement;
  const formData = new FormData(form);

  const name = formData.get("name") as string;

  const nameChanged = name !== playlist.value.name;
  const imgChanged = image.value !== undefined;

  if (!nameChanged && !imgChanged) {
    emit("hideModal");
    return;
  }

  clicked.value = true;

  formData.append("image", image.value);
  formData.append("settings", JSON.stringify(pStore.info.settings));

  if (name && name.toString().trim() !== "") {
    updatePlaylist(playlist.value.id, formData, pStore).then(() => {
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
  #modal-playlist-name-input {
    margin-bottom: 1rem;
  }

  .boxed {
    border: solid 2px $gray4;
    color: $gray1;
    place-items: center;
    display: grid;
    grid-template-columns: 1fr max-content;
  }

  .banner-settings {
    font-weight: 500;
    padding: 1rem;
    background-color: $gray5;
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    gap: $small;
    margin: $small 0 1rem 0;
  }

  #upload {
    width: 100%;
    display: grid;
    gap: $small;
    border: none;
    margin: $small 0 1rem 0;

    svg {
      height: 2rem;
    }

    #update-pl-img-preview {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: $small;
      object-fit: cover;
      background-color: $gray4;
      position: relative;
    }

    .clickable {
      font-weight: 500;
      height: 100%;
      width: 100%;
      display: flex;
      gap: $smaller;
      place-items: center;
      place-content: center;
      border-radius: $small;
      border: dashed 1px $gray4;
      cursor: pointer;
      padding: $medium;

      svg {
        transform: scale(0.75);
        flex-shrink: 0;
      }
    }

    .delete-icon {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.521);
      border-radius: $small;
      transition: all 0.2s ease-out;
      display: flex;
      place-content: center;
      place-items: center;
      cursor: pointer;

      svg {
        transform: scale(1);
        color: rgb(255, 255, 255);
      }

      &:hover {
        background-color: $red;

        svg {
          transform: scale(1.25);
          transform-origin: center;
        }
      }
    }
  }

  .banner-position-adjust {
    gap: 1rem;
    padding: $small 1rem;
    margin-bottom: 1rem;

    .t-center {
      position: relative;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }

    .buttons {
      display: grid;
      gap: $small;

      button {
        aspect-ratio: 1;
        height: 2rem;
        width: 2rem;
        border: none;
        background-color: $gray4;
        padding: 0;

        &:first-child {
          transform: rotate(-90deg);
        }

        &:last-child {
          transform: rotate(90deg);
        }

        &:hover {
          background-color: $blue;
        }
      }
    }
  }
}
</style>
