<template>
    <!-- <SongList
  :tracks="duplicateTracks(tracks)"
    :handle-play="handlePlay"
    :is_queue="false"
    :drop-handler="() => {}"
    :source="dropSources.favorite"
    :total="tracks.length"
    >
  </SongList> -->
    <GenericTrackPagination
        :tracks="tracks"
        :desc="`You have ${tracks.length} favorited track${tracks.length == 1 ? '' : 's'}`"
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

import { dropSources } from '@/enums'
import { Track } from '@/interfaces'
import { getFavTracks } from '@/requests/favorite'

import SongList from '@/components/shared/SongList.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import GenericTrackPagination from '@/components/shared/GenericTrackPagination.vue'
import HeartSvg from '@/assets/icons/heart.svg'
import { track_limit } from '@/stores/content-width'

let trackCount = 0
let waitingForMore = false

const tracks: Ref<Track[]> = ref([])
const queue = useQueueStore()
const tracklist = useTracklist()

async function loadMore() {
    if (waitingForMore || (trackCount && trackCount <= tracks.value.length)) return

    waitingForMore = true
    const start = tracks.value.length ? track_limit.value + tracks.value.length : 0
    const data = await getFavTracks(start, track_limit.value)

    if (data.total !== -1) {
        trackCount = data.total
    }

    // reverse the index so that the first track has the highest index
    tracks.value.push(
        ...data.tracks.map((t, i) => {
            const index = trackCount - i
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
    if (tracks.value.length === trackCount) {
        tracklist.setFromFav(tracks.value)
    } else {
        const tracks = (await getFavTracks(0, trackCount)).tracks
        tracklist.setFromFav(tracks)
    }

    queue.play(index)
}
</script>
