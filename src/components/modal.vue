<template>
    <!-- 👇 login modal should not be dismissable -->
    <div v-if="modal.visible || modal.component == ModalOptions.login" class="modal">
        <div class="bg" @click="modal.hideModal"></div>
        <div
            v-motion-slide-top
            class="m-content rounded"
            :class="{
                settings: modal.component == modal.options.settings,
                authlogin: modal.component == modal.options.login,
            }"
            :style="{
                maxWidth: modal.component == modal.options.setRootDirs ? '56rem' : '30rem',
            }"
        >
            <!-- TODO: MOVE MAX WIDTH TO CLASS -->
            <div class="heading">{{ modal.title }}</div>
            <AuthLogin v-if="modal.component == modal.options.login" />
            <NewPlaylist
                v-if="modal.component == modal.options.newPlaylist"
                v-bind="modal.props"
                @hideModal="hideModal"
                @setTitle="setTitle"
            />
            <UpdatePlaylist
                v-if="modal.component == modal.options.updatePlaylist"
                v-bind="modal.props"
                @hideModal="hideModal"
                @setTitle="setTitle"
            />
            <div v-if="modal.component == modal.options.deletePlaylist">
                <ConfirmModal
                    :text="'Are you sure you want to permanently delete this playlist?'"
                    :cancel-action="modal.hideModal"
                    :confirm-action="deletePlaylist"
                />
            </div>
            <SetRootDirs v-if="modal.component == modal.options.setRootDirs" @hideModal="hideModal" />
            <RootDirsPrompt v-if="modal.component == modal.options.rootDirsPrompt" @hideModal="hideModal" />
            <Settings @set-title="setTitle" v-if="modal.component == modal.options.settings" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { deletePlaylist as delPlaylist } from "@/requests/playlists";
import useModalStore, { ModalOptions } from "@/stores/modal";
import { useRouter } from "vue-router";

import AuthLogin from "./modals/AuthLogin.vue";
import ConfirmModal from "./modals/ConfirmModal.vue";
import NewPlaylist from "./modals/NewPlaylist.vue";
import RootDirsPrompt from "./modals/RootDirsPrompt.vue";
import SetRootDirs from "./modals/SetRootDirs.vue";
import Settings from "./modals/Settings.vue";
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
        border: none;
        background-color: $gray5;

        color: #fff;
        width: 100%;
        padding: $small $medium;
        font-size: 14px;
        outline: none;
        height: 2.75rem !important;
    }

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // opacity: 0;
        // visibility: hidden;
        background-color: rgb(0, 0, 0, 0.6);
        // transition: opacity 300ms ease, visibility 300ms ease;
        //background-color: rgba(22, 22, 22, 0.8);
        // backdrop-filter: blur(5px);
    }

    .m-content {
        width: calc(100% - 4rem);
        max-height: calc(100% - 4rem);
        padding: 2rem 1.25rem;
        position: relative;
        background-color: $black;

        @include allPhones {
            width: calc(100% - 2rem);
            max-height: calc(100% - 2rem);
            padding: 2rem 1rem;
        }
    }

    .m-content.settings {
        max-width: 50rem !important;
        padding: 0;
        overflow: hidden;
        // min-height: 39rem;
    }

    .m-content.authlogin {
        padding: 0;
    }
}
</style>
