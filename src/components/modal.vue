<template>
  <div class="modal" v-if="modal.visible">
    <div class="bg" @click="modal.hideModal"></div>
    <div
      class="m-content rounded"
      :style="{
        maxWidth:
          modal.component == modal.options.setRootDirs ? '56rem' : '30rem',
      }"
    >
      <div class="heading">{{ modal.title }}</div>
      <div class="close image" @click="modal.hideModal"></div>
      <NewPlaylist
        v-if="modal.component == modal.options.newPlaylist"
        :track="modal.props.track"
        @hideModal="hideModal"
        @setTitle="setTitle"
      />
      <UpdatePlaylist
        :playlist="modal.props"
        v-if="modal.component == modal.options.updatePlaylist"
        @hideModal="hideModal"
        @setTitle="setTitle"
      />
      <WelcomeModal v-if="modal.component == modal.options.welcome" />
      <div v-if="modal.component == modal.options.deletePlaylist">
        <ConfirmModal
          :text="'Are you sure you want to permanently delete this playlist?'"
          :cancelAction="modal.hideModal"
          :confirmAction="deletePlaylist"
        />
      </div>
      <SetIP
        v-if="modal.component == modal.options.SetIP"
        @setTitle="setTitle"
      />
      <SetRootDirs
        v-if="modal.component == modal.options.setRootDirs"
        @hideModal="hideModal"
      />
      <RootDirsPrompt v-if="modal.component == modal.options.rootDirsPrompt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import useModalStore from "../stores/modal";
import { deletePlaylist as delPlaylist } from "@/composables/fetch/playlists";

import SetIP from "./modals/SetIP.vue";
import WelcomeModal from "./WelcomeModal.vue";
import NewPlaylist from "./modals/NewPlaylist.vue";
import SetRootDirs from "./modals/SetRootDirs.vue";
import ConfirmModal from "./modals/ConfirmModal.vue";
import UpdatePlaylist from "./modals/updatePlaylist.vue";
import RootDirsPrompt from "./modals/RootDirsPrompt.vue";

const modal = useModalStore();
const router = useRouter();

function setTitle(title: string) {
  modal.setTitle(title);
}

function hideModal() {
  modal.hideModal();
}

function deletePlaylist() {
  delPlaylist(modal.props.pid)
    .then(() => modal.hideModal())
    .then(() => router.back());
}
</script>

<style lang="scss">
.modal {
  position: fixed;
  z-index: 20;
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: center;

  input[type="text"] {
    margin: $small 0;
    border: 2px solid $gray3;
    background-color: transparent;
    color: #fff;
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    outline: none;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(12, 12, 12, 0.767);
  }

  .m-content {
    width: calc(100% - 4rem);
    // height: max-content;
    max-height: 40rem;
    padding: 2rem;
    position: relative;
    background-color: $black;
    overflow: hidden;

    .close {
      width: 2rem;
      height: 2rem;
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-image: url("../assets/icons/plus.svg");
      transform: rotate(45deg);
      cursor: pointer;

      &:hover {
        transform: rotate(45deg) scale(1.2);
      }
    }
  }
}
</style>
