<template>
    <div class="right-search-top-tracks">
        <template v-for="(track, index) in search.top_results.tracks" :key="track.trackhash">
            <SearchWorkRow
                v-if="track.classical"
                :track="track"
                :is-current="queue.currenttrackhash === track.trackhash"
                @play-this="handlePlay(track)"
            />
            <TrackItem
                v-else
                :track="track"
                :index="index"
                :is-current="false"
                :is-current-playing="false"
                @play-this="handlePlay(track)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { Track } from '@/interfaces'

import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import useSearchStore from '@/stores/search'

import TrackItem from '@/components/shared/TrackItem.vue'
import SearchWorkRow from '@/components/Classical/SearchWorkRow.vue'

const search = useSearchStore()
const queue = useQueueStore()
const tracklist = useTracklist()

function handlePlay(track: Track) {
    queue.clearQueue()
    tracklist.setFromSearch(search.query, [track])
    queue.play(0)
}
</script>

<style lang="scss">
.right-search-top-tracks {
    margin: 0 1rem 2rem $small;
}
</style>
