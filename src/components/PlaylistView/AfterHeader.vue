<template>
    <div class="p-after-header">
        <div class="heading">All Tracks</div>

        <div class="actions">
            <div class="sort-wrap">
                <DropDown
                    :items="sortItems"
                    :current="currentSort"
                    component_key="playlist-sortbar"
                    :reverse="playlist.trackSortReverse"
                    @item-clicked="handleSortKeySet"
                />
            </div>

            <button v-if="canManage" class="action-btn" type="button" @click="downloadPlaylist">Export CSV</button>
            <button v-if="canManage" class="action-btn" type="button" @click="openSpotifyImport">Import Spotify CSV</button>
            <input
                ref="fileInput"
                type="file"
                accept=".csv,text/csv"
                class="hidden-input"
                @change="handleFileSelected"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import DropDown from '@/components/shared/DropDown.vue'
import { exportPlaylist, importSpotifyCsv } from '@/requests/playlists'
import usePlaylistStore from '@/stores/pages/playlist'

const playlist = usePlaylistStore()
const fileInput = ref<HTMLInputElement | null>(null)

interface SortItem {
    key: string
    title: string
}

const sortItems: SortItem[] = [
    { key: 'default', title: 'Playlist Order' },
    { key: 'title', title: 'Title' },
    { key: 'filepath', title: 'File Name' },
    { key: 'album', title: 'Album' },
    { key: 'artists', title: 'Artist' },
    { key: 'date', title: 'Release Date' },
    { key: 'last_mod', title: 'Date Added' },
    { key: 'lastplayed', title: 'Last Played' },
    { key: 'playcount', title: 'Play Count' },
    { key: 'playduration', title: 'Play Duration' },
]

const currentSort = computed(() => {
    return sortItems.find(item => item.key === playlist.trackSortBy) || sortItems[0]
})

const canManage = computed(() => Number.isInteger(playlist.info.id))

function handleSortKeySet(item: SortItem) {
    playlist.setPlaylistTrackSortKey(item.key)
}

async function downloadPlaylist() {
    await exportPlaylist(playlist.info.id, playlist.info.name)
}

function openSpotifyImport() {
    fileInput.value?.click()
}

async function handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    const res = await importSpotifyCsv(playlist.info.id, file)
    if (res) {
        playlist.allTracks = []
        await playlist.fetchAll(playlist.info.id)
    }

    input.value = ''
}
</script>

<style lang="scss">
.hidden-input {
    display: none;
}

.p-after-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 64px;
    padding: 0 1rem;
    margin-top: $small;
    color: $gray1;

    @media only screen and (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 0.5rem;
    }

    .heading {
        font-size: 14px;
        font-weight: 500;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: flex-end;
    }

    .sort-wrap {
        position: relative;
        z-index: 40;
    }

    .action-btn {
        border: 1px solid $gray4;
        background: $gray5;
        color: $gray1;
        border-radius: 999px;
        padding: 0.5rem 0.9rem;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.15s ease;

        &:hover {
            background: $gray4;
        }
    }

    .playlist-sortbar {
        position: static !important;
        width: 10rem;

        .selected {
            background-color: transparent;
            opacity: 1;
        }

        .options {
            background-color: $gray;
            opacity: 1;
        }
    }
}
</style>
