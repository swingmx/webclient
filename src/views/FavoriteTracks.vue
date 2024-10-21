<template>
    <GenericTrackPagination
        :tracks="tracks"
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
            </GenericHeader>
        </template>
    </GenericTrackPagination>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'

import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'

import { Track } from '@/interfaces'
import { getFavTracks } from '@/requests/favorite'

import GenericHeader from '@/components/shared/GenericHeader.vue'
import GenericTrackPagination from '@/components/shared/GenericTrackPagination.vue'
import HeartSvg from '@/assets/icons/heart.svg'
import { track_limit } from '@/stores/content-width'

const trackCount = ref(0)
let waitingForMore = false

const tracks: Ref<Track[]> = ref([])
const queue = useQueueStore()
const tracklist = useTracklist()

async function loadMore() {
    if (waitingForMore || (trackCount.value && trackCount.value <= tracks.value.length)) return

    waitingForMore = true
    const start = tracks.value.length ? tracks.value.length : 0
    const data = await getFavTracks(start, track_limit.value)

    if (data.total !== -1) {
        trackCount.value = data.total
    }

    // reverse the index so that the first track has the highest index
    tracks.value.push(
        ...data.tracks.map((t, i) => {
            const index = trackCount.value - i
            const master_index = i
            return { ...t, index, master_index }
        })
    )

    waitingForMore = false
}

onMounted(async () => {
    await loadMore()
})

async function handlePlay(index: number) {
    if (tracks.value.length === trackCount.value) {
        tracklist.setFromFav(tracks.value)
    } else {
        const remainder = (await getFavTracks(tracks.value.length, trackCount.value)).tracks
        tracklist.setFromFav([...tracks.value, ...remainder])
    }

    queue.play(index)
}
</script>
