<template>
  <div class="modal" v-if="modal.visible">
    <div class="bg" @click="modal.hideModal"></div>
    <div class="m-content rounded">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import useModalStore from "../stores/modal";

import NewPlaylist from "./modals/NewPlaylist.vue";
import UpdatePlaylist from "./modals/updatePlaylist.vue";
import WelcomeModal from "./WelcomeModal.vue";
import ConfirmModal from "./modals/ConfirmModal.vue";
import { deletePlaylist as delPlaylist } from "@/composables/fetch/playlists";
import { useRouter } from "vue-router";
import SetIP from "./modals/SetIP.vue";

const modal = useModalStore();
const router = useRouter();
/**
 * Sets the modal title
 * @param title
 */
function setTitle(title: string) {
  modal.setTitle(title);
}

/**
 * Handle the emit to hide the modal
 */
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
    width: 100%;
    max-width: 30rem;
    padding: 2rem;
    position: relative;
    background-color: $black;

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
