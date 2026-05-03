<template>
    <div id="p-view" class="content-page">
        <Header>
            <template #name>Playlists</template>
            <template #description>
                You have {{ pStore.playlists.length }} playlists in your library
                <br />
                <form spellcheck="false" @submit.prevent="() => {}">
                    <input
                        id="playlistsearch"
                        v-model="input"
                        class="rounded-sm no-border"
                        type="search"
                        placeholder="Search playlists"
                        name=""
                    />
                </form>
            </template>
            <template #right>
                <div class="playlist-actions">
                    <button class="playlist-button import-button" @click="openSpotifyImport">Import Spotify CSV</button>
                    <button class="playlist-button" @click="showNewPlaylistModal()"><PlusSvg /> New Playlist</button>
                    <input
                        ref="fileInput"
                        type="file"
                        accept=".csv,text/csv"
                        class="hidden-input"
                        @change="handleFileSelected"
                    />
                </div>
            </template>
        </Header>
        <PlaylistCardGroup v-if="!query && pinnedPlaylists.length" :playlists="pinnedPlaylists" :title="'Pinned'" />
        <PlaylistCardGroup
            v-if="playlists.length"
            :playlists="playlists"
            :title="query ? 'Search Results' : `${pinnedPlaylists.length ? 'Other' : 'All'} Playlists`"
        />
        <NoItems
            :flag="!(playlists.length + pinnedPlaylists.length)"
            :icon="PlaylistSvg"
            :title="'No playlists found'"
            :description="description"
        />
    </div>
</template>

<script setup lang="ts">
import { debouncedRef } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

import usePStore from '@/stores/pages/playlists'
import { useFuse } from '@/utils'
import updatePageTitle from '@/utils/updatePageTitle'
import { createNewPlaylist, importSpotifyCsv } from '@/requests/playlists'

import PlaylistSvg from '@/assets/icons/playlist-1.svg'
import PlusSvg from '@/assets/icons/plus.svg'
import PlaylistCardGroup from '@/components/PlaylistsList/PlaylistCardGroup.vue'
import Header from '@/components/shared/GenericHeader.vue'
import NoItems from '@/components/shared/NoItems.vue'
import useModalStore from '@/stores/modal'

const pStore = usePStore()
const { showNewPlaylistModal } = useModalStore()
const fileInput = ref<HTMLInputElement | null>(null)

const input = ref('')
const query = debouncedRef(input, 300)

const description = `You can create a playlist by right clicking on a track and selecting the
        "Add to Playlist" option`

// TODO: When you add a song to playlist when you are in this page, increase the count on the card.

const pinnedPlaylists = computed(() => {
    return pStore.playlists.filter(p => p.pinned)
})

onMounted(() => {
    updatePageTitle('Playlists')
})

function openSpotifyImport() {
    fileInput.value?.click()
}

function makePlaylistNameFromFile(filename: string) {
    return filename.replace(/\.csv$/i, '').replace(/[_-]+/g, ' ').trim() || 'Imported Playlist'
}

async function handleFileSelected(event: Event) {
    const inputElem = event.target as HTMLInputElement
    const file = inputElem.files?.[0]

    if (!file) return

    const playlistName = makePlaylistNameFromFile(file.name)
    const playlist = await createNewPlaylist(playlistName)

    if (playlist) {
        await importSpotifyCsv(playlist.id, file)
        await pStore.fetchAll()
    }

    inputElem.value = ''
}

const playlists = computed(() => {
    if (!query.value) {
        return pStore.playlists.filter(p => !p.pinned)
    }

    const p = useFuse(query.value, pStore.playlists, {
        keys: ['name'],
    })

    return p.value.map(r => r.item)
})
</script>

<style lang="scss">
#p-view {
    padding-bottom: $content-padding-bottom;
    height: 100%;
    overflow: auto;

    .hidden-input {
        display: none;
    }

    .playlist-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .playlist-button {
        svg {
            height: 1.5rem;
        }
    }

    .import-button {
        padding-right: $medium;
    }

    .grid {
        grid-template-columns: repeat(auto-fill, minmax($cardwidth, 1fr));
        gap: 2.5rem 1.5rem;

        @include mediumPhones {
            grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
            gap: 1rem;
        }
    }

    #playlistsearch {
        width: 16rem;
        max-width: 100%;
        margin-top: 1rem;
        background-color: $gray5;
        color: white;
        font-size: 0.95rem;
        font-weight: 500;
        padding: $medium;
        outline: none;
        appearance: none;
    }

    .playlist-button {
        padding-right: $medium;
    }

    .nothing {
        height: 50%;

        svg {
            margin-bottom: 0;
        }
    }
}
</style>
