<template>
    <GenericTrackPagination
        :tracks="sortedTracks"
        :desc="`You have ${trackCount} favorited track${trackCount == 1 ? '' : 's'}`"
        :noitemsicon="HeartSvg"
        :more-items-loader="loadMore"
        @playThis="handlePlay"
    >
        <template #header>
            <GenericHeader>
                <template #name>Favorite Tracks</template>
                <template #description
                    >You have {{ trackCount }} favorited track{{ trackCount == 1 ? '' : 's' }}</template
                >
                <template #right>
                    <DropDown
                        :items="sortItems"
                        :current="currentSort"
                        component_key="favorite-track-sortbar"
                        :reverse="sortReverse"
                        @item-clicked="handleSort"
                    />
                </template>
            </GenericHeader>
        </template>
    </GenericTrackPagination>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, onMounted, ref } from 'vue'

import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'

import { Track } from '@/interfaces'
import { getFavTracks } from '@/requests/favorite'

import DropDown from '@/components/shared/DropDown.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import GenericTrackPagination from '@/components/shared/GenericTrackPagination.vue'
import HeartSvg from '@/assets/icons/heart.svg'
import { track_limit } from '@/stores/content-width'

const trackCount = ref(0)
let waitingForMore = false

const tracks: Ref<Track[]> = ref([])
const queue = useQueueStore()
const tracklist = useTracklist()
const sortBy = ref('default')
const sortReverse = ref(false)

interface SortItem {
    key: string
    title: string
}

const sortItems: SortItem[] = [
    { key: 'default', title: 'Favorite Order' },
    { key: 'title', title: 'Title' },
    { key: 'album', title: 'Album' },
    { key: 'artists', title: 'Artist' },
    { key: 'duration', title: 'Duration' },
]

const currentSort = computed(() => {
    return sortItems.find(item => item.key === sortBy.value) || sortItems[0]
})

function sortTrackList(items: Track[]) {
    const byArtist = (track: Track) => track.artists?.[0]?.name?.toLowerCase() || ''

    items.sort((a, b) => {
        switch (sortBy.value) {
            case 'title':
                return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
            case 'album':
                return a.album.localeCompare(b.album, undefined, { sensitivity: 'base' })
            case 'artists':
                return byArtist(a).localeCompare(byArtist(b), undefined, { sensitivity: 'base' })
            case 'duration':
                return (a.duration || 0) - (b.duration || 0)
            default:
                return (b.master_index || 0) - (a.master_index || 0)
        }
    })

    return sortReverse.value ? items.reverse() : items
}

const sortedTracks: ComputedRef<Track[]> = computed(() => sortTrackList([...tracks.value]))

function handleSort(item: SortItem) {
    if (item.key === sortBy.value) {
        sortReverse.value = !sortReverse.value
        return
    }

    sortBy.value = item.key
    sortReverse.value = false
}

async function loadMore() {
    if (waitingForMore || (trackCount.value && trackCount.value <= tracks.value.length)) return

    waitingForMore = true
    const start = tracks.value.length ? tracks.value.length : 0
    const data = await getFavTracks(start, track_limit.value)

    if (data.total !== -1) {
        trackCount.value = data.total
    }

    const startIndex = trackCount.value - start - 1
    const startMasterIndex = start

    tracks.value.push(
        ...data.tracks.map((t, i) => {
            const index = startIndex - i
            const master_index = startMasterIndex + i
            return { ...t, index, master_index }
        })
    )

    waitingForMore = false
}

onMounted(async () => {
    await loadMore()
})

async function handlePlay(index: number) {
    let playTracks = sortedTracks.value

    if (tracks.value.length !== trackCount.value) {
        const remainder = (await getFavTracks(tracks.value.length, trackCount.value)).tracks
        playTracks = sortTrackList([...tracks.value, ...remainder])
    }

    tracklist.setFromFav(playTracks)

    queue.play(index)
}
</script>

