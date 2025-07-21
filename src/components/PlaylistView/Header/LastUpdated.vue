<template>
    <div class="last-updated">
        <span v-if="!isHeaderSmall" class="status">{{ t('PlaylistView.LastUpdated', { date: playlist.info._last_updated }) }}</span>
        <div v-if="Number.isInteger(playlist.info.id)" class="edit">
            &#160;&#160;|&#160;&#160; <span @click="editPlaylist">{{ t('PlaylistView.Edit') }}</span>&#160;&#160;
            {{ Number.isInteger(playlist.info.id) ? ' | ' : '' }}
            <DeleteSvg class="edit" @click="deletePlaylist" />
        </div>
    </div>
</template>
<script setup lang="ts">
import DeleteSvg from '@/assets/icons/delete.svg'

import { isHeaderSmall } from '@/stores/content-width'

import useModalStore from '@/stores/modal'
import usePStore from '@/stores/pages/playlist'
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playlist = usePStore()
const modal = useModalStore()

function editPlaylist() {
    modal.showEditPlaylistModal()
}

function deletePlaylist() {
    modal.showDeletePlaylistModal(playlist.info.id)
}
</script>

<style lang="scss">
.last-updated {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    padding: $smaller $small;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: $smaller;
    z-index: 12;

    display: flex;
    align-items: center;

    .edit {
        display: flex;
        align-items: center;
    }

    .edit > span {
        cursor: pointer;
        color: $brown;
    }

    svg {
        transform: scale(0.75);
        margin-bottom: -0.2rem;
        color: $red !important;
        height: 1.5rem;
    }
}
</style>
