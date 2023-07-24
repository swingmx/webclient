<template>
  <div class="modal" v-if="modal.visible">
    <div class="bg" @click="modal.hideModal"></div>
    <div
      class="m-content rounded"
      :style="{
        maxWidth:
          modal.component == modal.options.setRootDirs ? '56rem' : '30rem',
      }"
      v-motion-slide-top
    >
      <div class="heading">{{ modal.title }}</div>
      <div class="close circular" @click="modal.hideModal">
        <PlusSvg />
      </div>
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
      <RootDirsPrompt
        v-if="modal.component == modal.options.rootDirsPrompt"
        @hideModal="hideModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { deletePlaylist as delPlaylist } from "@/requests/playlists";
import { useRouter } from "vue-router";
import useModalStore from "@/stores/modal";

import PlusSvg from "@/assets/icons/plus.svg";
import WelcomeModal from "./WelcomeModal.vue";
import ConfirmModal from "./modals/ConfirmModal.vue";
import NewPlaylist from "./modals/NewPlaylist.vue";
import RootDirsPrompt from "./modals/RootDirsPrompt.vue";
import SetIP from "./modals/SetIP.vue";
import SetRootDirs from "./modals/SetRootDirs.vue";
import UpdatePlaylist from "./modals/updatePlaylist.vue";

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

  input[type="search"] {
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
    max-height: 40rem;
    padding: 2rem;
    position: relative;
    background-color: $black;
    border: solid 1px $gray5;

    @include smallPhone {
      width: calc(100% - 2rem);
      padding: 2rem 1rem;
    }

    .close {
      position: absolute;
      top: 1.5rem;
      right: 1.25rem;

      transform: rotate(45deg);

      svg {
        background-color: $gray3;
        border-radius: 1rem;
      }

      cursor: pointer;
      opacity: 0.75;

      &:hover {
        svg {
          background-color: $red;
        }
      }
    }
  }
}
</style>
