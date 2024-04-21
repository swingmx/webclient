<template>
    <div
        v-if="modal.visible"
        class="modal"
    >
        <div
            class="bg"
            @click="modal.hideModal"
        ></div>
        <div
            v-motion-slide-top
            class="m-content rounded"
            :style="{
                maxWidth:
                    modal.component == modal.options.setRootDirs
                        ? '56rem'
                        : '30rem',
            }"
        >
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
            <WelcomeModal v-if="modal.component == modal.options.welcome" />
            <div v-if="modal.component == modal.options.deletePlaylist">
                <ConfirmModal
                    :text="'Are you sure you want to permanently delete this playlist?'"
                    :cancel-action="modal.hideModal"
                    :confirm-action="deletePlaylist"
                />
            </div>
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
import { deletePlaylist as delPlaylist } from '@/requests/playlists'
import useModalStore from '@/stores/modal'
import { useRouter } from 'vue-router'

import WelcomeModal from './WelcomeModal.vue'
import AuthLogin from './modals/AuthLogin.vue'
import ConfirmModal from './modals/ConfirmModal.vue'
import NewPlaylist from './modals/NewPlaylist.vue'
import RootDirsPrompt from './modals/RootDirsPrompt.vue'
import SetRootDirs from './modals/SetRootDirs.vue'
import UpdatePlaylist from './modals/updatePlaylist.vue'

const modal = useModalStore()
const router = useRouter()

function setTitle(title: string) {
    modal.setTitle(title)
}

function hideModal() {
    modal.hideModal()
}

function deletePlaylist() {
    delPlaylist(modal.props.pid)
        .then(() => modal.hideModal())
        .then(() => router.back())
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

    input[type='search'] {
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
        background-color: rgba(12, 12, 12, 0.767);
        backdrop-filter: blur(15px);
    }

    .m-content {
        width: calc(100% - 4rem);
        max-height: 40rem;
        padding: 2rem 1.25rem;
        position: relative;
        background-color: $black;

        @include smallPhone {
            width: calc(100% - 2rem);
            padding: 2rem 1rem;
        }
    }
}
</style>
