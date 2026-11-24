<template>
    <!-- 👇 login modal should not be dismissable -->
    <div v-if="modal.visible || modal.component == ModalOptions.login" class="modal">
        <div class="bg" @click="modal.hideModal"></div>
        <div
            v-motion-slide-top
            class="m-content"
            :class="{
                settings: modal.component == modal.options.settings,
            }"
        >
            <header v-if="!headless" class="m-header">
                <div>
                    <div class="m-title">{{ modal.title }}</div>
                    <div v-if="modal.subtitle" class="m-subtitle">{{ modal.subtitle }}</div>
                </div>
                <button class="m-close" :aria-label="$t('ConfirmModal.Cancel')" @click="modal.hideModal">
                    <svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                </button>
            </header>
            <AuthLogin v-if="modal.component == modal.options.login" />
            <NewPlaylist
                v-if="modal.component == modal.options.newPlaylist"
                v-bind="modal.props"
                @hideModal="hideModal"
                @setTitle="setTitle"
            />
            <CrudPage
                v-if="modal.component == modal.options.page"
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
            <ConfirmModal
                v-if="modal.component == modal.options.deletePlaylist"
                :text="$t('Modal.DeletePlaylist')"
                :cancel-action="modal.hideModal"
                :confirm-action="deletePlaylist"
            />
            <Settings v-if="modal.component == modal.options.settings" @set-title="setTitle" />
            <EditArtist v-if="modal.component == modal.options.editArtist" v-bind="modal.props" @hideModal="hideModal" />
            <MergeArtist v-if="modal.component == modal.options.mergeArtist" v-bind="modal.props" @hideModal="hideModal" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { dropPage } from '@/composables/pageCache'
import { deletePlaylist as delPlaylist } from '@/requests/playlists'
import useModalStore, { ModalOptions } from '@/stores/modal'
import usePlaylistListStore from '@/stores/pages/playlists'
import { useRouter } from 'vue-router'

import AuthLogin from './modals/AuthLogin.vue'
import ConfirmModal from './modals/ConfirmModal.vue'
import CrudPage from './modals/CrudPage.vue'
import EditArtist from './modals/EditArtist.vue'
import MergeArtist from './modals/MergeArtist.vue'
import NewPlaylist from './modals/NewPlaylist.vue'
import Settings from './modals/Settings.vue'
import UpdatePlaylist from './modals/updatePlaylist.vue'

const modal = useModalStore()
const router = useRouter()
// dialogs with their own layout inside the frame, without the shared header
const headless = computed(() => [ModalOptions.login, ModalOptions.settings].includes(modal.component))

function setTitle(title: string) {
    modal.setTitle(title)
}

function hideModal() {
    modal.hideModal()
}

async function deletePlaylist() {
    const pid = modal.props.pid
    const deleted = await delPlaylist(pid)
    modal.hideModal()
    if (!deleted) return

    usePlaylistListStore().removePlaylist(pid)

    const route = router.currentRoute.value
    if (route.name !== 'PlaylistView' || String(route.params.pid) !== String(pid)) return

    dropPage(route.fullPath)
    router.back()
}
</script>

<style lang="scss">
.modal {
    position: fixed;
    z-index: 21;
    height: 100vh;
    width: 100vw;
    display: grid;
    place-items: center;

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0, 0, 0, 0.6);
    }

    .m-content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: calc(100% - 2rem);
        max-width: 500px;
        max-height: calc(100% - 4rem);
        overflow: hidden;
        background-color: $gray;
        // border: 1px solid $gray5;
        border-radius: 16px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
        color: $white;
        text-align: left;

        @include allPhones {
            max-height: calc(100% - 2rem);
        }

    }

    // one height for every settings tab; long tabs scroll inside it
    .m-content.settings {
        max-width: 50rem;
        height: min(45rem, calc(100% - 4rem));

        @include allPhones {
            height: calc(100% - 2rem);
        }
    }

    button:focus-visible {
        outline: 2px solid $white;
        outline-offset: 2px;
    }

    .m-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        padding: 20px 20px 4px 24px;
    }

    .m-title {
        font-size: 18px;
        font-weight: 700;
    }

    .m-subtitle {
        margin-top: 2px;
        font-size: 13px;
        color: $gray1;
    }

    .m-close {
        display: grid;
        place-items: center;
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 8px;
        background: transparent;
        color: $gray1;

        &:hover {
            background-color: $gray5;
            color: $white;
        }

        svg {
            width: 16px;
            height: 16px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.5;
            stroke-linecap: round;
        }
    }

    // a dialog's root: a scrolling .m-body above an optional .m-footer
    .m-dialog {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
    }

    .m-body {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 22px;
        min-height: 0;
        padding: 18px 24px 24px;
        overflow-y: auto;

        > * {
            flex-shrink: 0;
        }

        section {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }

    .m-label {
        font-size: 13px;
        font-weight: 600;
        color: $white;
    }

    .m-input {
        width: 100%;
        padding: 11px 12px;
        font-size: 15px;
        color: $white;
        background-color: $bars;
        border: 1px solid $gray5;
        border-radius: 9px;
        outline: none;

        &::placeholder {
            color: $gray2;
        }

        &:focus {
            border-color: $gray2;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06);
        }
    }

    .m-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding: 14px 20px;
        border-top: 1px solid $gray5;
    }

    .m-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: auto;
        padding: 8px 14px;
        border-radius: 8px;
        // overrides the global button font size
        font-size: 13px !important;
        font-weight: 600;
        border: none;
        cursor: pointer;

        svg {
            width: 14px;
            height: 14px;
        }

        &.secondary {
            background-color: $gray5;
            color: $white;

            &:hover {
                background-color: $gray4;
            }
        }

        // a quiet destructive action, left of the footer's main buttons
        &.danger {
            margin-right: auto;
            padding-left: 4px;
            background-color: transparent;
            color: $red;

            &:hover {
                color: lighten($red, 6%);
            }
        }

        &:disabled {
            opacity: 0.5;
            cursor: default;
        }

        &.ghost {
            background-color: transparent;
            color: $gray1;

            &:hover {
                background-color: $gray5;
                color: $white;
            }
        }

        &.primary {
            background-color: $white;
            color: $black;

            &:hover {
                background-color: #fff;
            }

            &:disabled {
                opacity: 1;
                background-color: $gray5;
                color: $gray2;
                cursor: default;
            }
        }

        // the main action of a dialog that only deletes
        &.destructive {
            background-color: $red;
            color: $white;

            &:hover {
                background-color: lighten($red, 6%);
            }
        }
    }
}
</style>
