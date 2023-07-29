<template>
  <form
    @submit.prevent="update_playlist"
    id="playlist-update-modal"
    class="playlist-modal"
    enctype="multipart/form-data"
    autocomplete="off"
  >
    <label for="name">Playlist name</label>
    <input
      type="search"
      class="rounded-sm"
      name="name"
      id="modal-playlist-name-input"
      v-model="pname"
      @keypress.enter="playlist.has_image && update_playlist"
    />

    <label for="image">Image</label>
    <input
      type="file"
      accept="image/*"
      name="image"
      id="update-pl-image-upload"
      style="display: none"
      @change="handleUpload"
      ref="dropZoneRef"
    />
    <div id="upload" class="boxed rounded-sm">
      <div
        class="clickable"
        @click="selectFiles"
        tabindex="0"
        @keydown.space.enter.stop="selectFiles"
      >
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
        <div
          class="delete-icon"
          v-if="!image && playlist.has_image"
          @click="pStore.removeBanner()"
        >
          <DeleteIcon />
        </div>
      </div>
    </div>
    <label v-if="playlist.has_image || !playlist.settings.sqr_img"
      >Settings</label
    >
    <div class="banner-settings rounded-sm" v-if="image || playlist.has_image">
      <div>Show square cover image</div>
      <Switch
        :state="playlist.settings.sqr_img"
        @click="pStore.toggleSquareImage"
      />
    </div>
    <div
      class="boxed banner-position-adjust rounded-sm"
      v-if="playlist.has_image && !playlist.settings.sqr_img"
    >
      <div class="t-center">
        Adjust image position • {{ pStore.info.settings.banner_pos }}%
      </div>
      <div class="buttons">
        <button @click.prevent="pStore.minusBannerPos">
          <ExpandSvg />
        </button>
        <button @click.prevent="pStore.plusBannerPos">
          <ExpandSvg />
        </button>
      </div>
    </div>

    <button>
      {{ clicked ? "Saving" : "Save" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Ref, onMounted, ref } from "vue";

import { paths } from "@/config";
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
  const input = document.getElementById(
    "update-pl-image-upload"
  ) as HTMLInputElement;
  input.click();
}

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
    pStore.setImage(obj_url);
  }

  image.value = file;
}

let clicked = ref(false);

function update_playlist(e: Event) {
  const form = document.getElementById(
    "playlist-update-modal"
  ) as HTMLFormElement;
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
  formData.append(
    "settings",
    JSON.stringify({
      sqr_img: pStore.info.settings.sqr_img,
      banner_pos: pStore.info.settings.banner_pos,
    })
  );

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
    background-color: $gray5;
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    margin: $small 0 1rem 0;
  }

  #upload {
    width: 100%;
    display: grid;
    gap: $small;
    border: none;
    margin: $small 0 1rem 0;

    #update-pl-img-preview {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: $small;
      object-fit: cover;
      background-color: $gray4;
      position: relative;
    }

    .clickable {
      height: 100%;
      width: 100%;
      display: flex;
      gap: $smaller;
      place-items: center;
      place-content: center;
      border-radius: $small;
      border: dashed 1px $gray4;
      cursor: pointer;

      svg {
        transform: scale(0.75);
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
          rotate: -90deg;
        }

        &:last-child {
          rotate: 90deg;
        }

        &:hover {
          background-color: $blue;
        }
      }
    }
  }
}
</style>
