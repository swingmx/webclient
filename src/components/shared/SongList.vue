<template>
    <div
        class="songlist queue-view-virtual-scroller v-scroll-page"
        :class="{ isSmall, isMedium, is_queue }"
        style="height: 100%"
    >
        <RecycleScroller
            id="songlist-scroller"
            class="scroller"
            style="height: 100%"
            :items="tracks.map((track, index) => ({ track, id: index }))"
            :item-size="itemHeight"
            key-field="id"
        >
            <!-- v-slot="{ item, index }" -->
            <template #before>
                <slot name="header"></slot>
            </template>
            <template #default="{ item, index }">
                <SongItem
                    :track="item.track"
                    :index="total ? total - index : index + 1"
                    :is_queue_track="is_queue"
                    :is_last="index == tracks.length - 1"
                    :droppable="false"
                    :source="source"
                    @playThis="handlePlay(index)"
                    @trackDropped="dropHandler"
                />
            </template>
        </RecycleScroller>
    </div>
</template>

<script setup lang="ts">
import SongItem from '@/components/shared/SongItem.vue'
import { dropSources } from '@/enums'
import { Track } from '@/interfaces'
import { isMedium, isSmall } from '@/stores/content-width'

defineProps<{
    tracks: Track[]
    is_queue?: boolean
    handlePlay: (index: number) => void
    dropHandler: (
        source: dropSources,
        track: Track,
        newIndex: number,
        oldIndex: number
    ) => void
    source: dropSources
    total?: number
}>()

const itemHeight = 64
</script>

<style lang="scss">
.songlist .generichead {
    padding-bottom: 2rem;
}

.queue-view-virtual-scroller.is_queue {
    .songlist-item.current {
        background-color: $darkestblue !important;
        border: none;
    }
}
</style>
