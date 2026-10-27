<template>
    <GenericTrackPagination
        :tracks="tracks"
        :desc="classical ? $t('Views.Favorites.NoClassicalDescription') : description"
        :empty-title="classical ? $t('Views.Favorites.NoClassical') : undefined"
        :classical="classical"
        :noitemsicon="HeartSvg"
        :more-items-loader="loadMore"
        @playThis="handlePlay"
    >
        <template #header>
            <GenericHeader>
                <template #name>{{
                    classical ? $t('Views.FavoriteTracks.ClassicalTitle') : $t('Views.FavoriteTracks.Title')
                }}</template>
                <template #description>{{ description }}</template>
            </GenericHeader>
        </template>
    </GenericTrackPagination>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'

import { FavTrackKind, Track } from '@/interfaces'
import { getFavTracks } from '@/requests/favorite'
import { useT } from '@/i18n'

import GenericHeader from '@/components/shared/GenericHeader.vue'
import GenericTrackPagination from '@/components/shared/GenericTrackPagination.vue'
import HeartSvg from '@/assets/icons/heart.svg'
import { track_limit } from '@/stores/content-width'

const { t } = useT()

// the kind of favorites "See all" was opened from
const queryKind = useRoute().query.kind as string
const kind: FavTrackKind = queryKind === 'tracks' || queryKind === 'classical' ? queryKind : 'all'
const classical = kind === 'classical'

const trackCount = ref(0)

const description = computed(() =>
    classical
        ? t('Views.FavoriteTracks.ClassicalDescription', { n_tr: trackCount.value }, trackCount.value)
        : t('Views.FavoriteTracks.Description', { n_tr: trackCount.value }, trackCount.value)
)
let waitingForMore = false

const tracks: Ref<Track[]> = ref([])
const queue = useQueueStore()
const tracklist = useTracklist()

async function loadMore() {
    if (waitingForMore || (trackCount.value && trackCount.value <= tracks.value.length)) return

    waitingForMore = true
    const start = tracks.value.length ? tracks.value.length : 0
    const data = await getFavTracks(start, track_limit.value, kind)

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
    if (tracks.value.length === trackCount.value) {
        tracklist.setFromFav(tracks.value)
    } else {
        const remainder = (await getFavTracks(tracks.value.length, trackCount.value, kind)).tracks
        tracklist.setFromFav([...tracks.value, ...remainder])
    }

    queue.play(index)
}
</script>
