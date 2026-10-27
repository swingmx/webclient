<template>
    <!-- <QueueActions /> -->
    <PlayingFrom />
    <div class="queue-virtual-scroller" @mouseover="mouseover = true" @mouseout="mouseover = false">
        <NoItems
            :flag="!store.tracklist.length"
            :title="$t('RightSidebar.NoQueueTitle')"
            :description="$t('RightSidebar.NoQueueDescription')"
            :icon="QueueSvg"
        />
        <DynamicScroller
            id="queue-scrollable"
            ref="scroller"
            class="scroller"
            style="height: 100%"
            :items="scrollerItems"
            :min-item-size="itemHeight"
        >
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[item.props]"
                    :data-index="index"
                >
                    <component
                        :is="item.component"
                        v-if="item.isHeader"
                        v-bind="item.props"
                        :is-current="item.trackIndex !== undefined && item.trackIndex === queue.currentindex"
                        @playThis="playFromQueue(item.playIndex)"
                    />
                    <div v-else :class="{ 'gap-above': item.gapAbove }">
                        <component
                            :is="item.component"
                            v-bind="item.props"
                            :is-current="item.trackIndex === queue.currentindex"
                            :is-current-playing="item.trackIndex === queue.currentindex && queue.playing"
                            @playThis="playFromQueue(item.trackIndex)"
                        ></component>
                    </div>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { ClassicalMovement } from '@/interfaces'
import useQStore from '@/stores/queue'
import useInterface from '@/stores/interface'
import useTracklist from '@/stores/queue/tracklist'

import NoItems from '../shared/NoItems.vue'
import QueueActions from './Queue/QueueActions.vue'
import TrackItem from '@/components/shared/TrackItem.vue'
import QueueMovement from '@/components/Classical/QueueMovement.vue'
import QueueWorkHead from '@/components/Classical/QueueWorkHead.vue'
import QueueSvg from '@/assets/icons/queue.svg'
import PlayingFrom from '../NowPlaying/PlayingFrom.vue'

interface QueueScrollerItem {
    id: string | number
    component: typeof TrackItem | typeof QueueWorkHead | typeof QueueMovement
    props: any
    // tracklist index for track/movement rows and single-movement heads,
    // undefined for other work headers
    trackIndex?: number
    // where a work header's play link starts
    playIndex?: number
    workhash?: string
    isHeader?: boolean
    gapAbove?: boolean
}

const itemHeight = 64

const queue = useQStore()
const store = useTracklist()
const mouseover = ref(false)
const scroller = ref<any>(null)

const { focusCurrentInSidebar, setScrollFunction } = useInterface()

// { id, component, props } items: each run of a work's movements is drawn
// under a QueueWorkHead, as numberless QueueMovement rows, or as the head
// alone when the run is one movement. Works are found by the workhash
// stamped at queue-insertion time. ids are queue positions: the same track
// can appear in the queue more than once, so filepath/trackhash are not
// valid keys here.
const scrollerItems = computed(() => {
    const items: QueueScrollerItem[] = []
    let prevWorkhash: string | null = null

    store.tracklist.forEach((track, index) => {
        const movement = track as ClassicalMovement
        const work = track.is_classical && movement.workhash ? store.worklist[movement.workhash] : undefined

        // movements with no resolvable work (e.g. a stale persisted queue)
        // degrade to plain track rows
        if (!work) {
            items.push({
                id: index,
                component: TrackItem,
                trackIndex: index,
                gapAbove: prevWorkhash !== null,
                props: { track, index, isQueueTrack: true },
            })
            prevWorkhash = null
            return
        }

        if (prevWorkhash !== work.workhash) {
            const run = workRun(index, work.workhash)
            const single = run.length === 1
            items.push({
                id: `work-${index}`,
                component: QueueWorkHead,
                isHeader: true,
                workhash: work.workhash,
                trackIndex: single ? index : undefined,
                playIndex: index,
                props: {
                    work,
                    albumhash: track.albumhash,
                    count: run.length,
                    movement: single ? movement : undefined,
                    trackIndex: index,
                },
            })
            prevWorkhash = work.workhash
            if (single) return
        }

        items.push({
            id: index,
            component: QueueMovement,
            trackIndex: index,
            workhash: work.workhash,
            props: { movement, index },
        })
    })

    const last = items[items.length - 1]
    if (last && last.component !== TrackItem) {
        last.props = { ...last.props, last: true }
    }

    return items
})

/**
 * The queued tracks from `start` that belong to one work, in a row.
 */
function workRun(start: number, workhash: string) {
    const run = []
    for (let i = start; i < store.tracklist.length; i++) {
        const track = store.tracklist[i] as ClassicalMovement
        if (!track.is_classical || track.workhash !== workhash) break
        run.push(track)
    }
    return run
}

function playFromQueue(index?: number) {
    if (index === undefined) return
    queue.play(index)
}

const show_above = 1 // the number of tracks to show above the current track

// measured row heights from the DynamicScroller (keyed by item id),
// falling back to min-item-size for rows not measured yet
function getItemSize(item: QueueScrollerItem): number {
    const sizes = scroller.value?.vscrollData?.sizes ?? {}
    const size = Number(sizes[item.id])
    return size > 0 ? size : itemHeight
}

function scrollToCurrent() {
    const items = scrollerItems.value
    const currentPos = items.findIndex(item => item.trackIndex === queue.currentindex)
    if (currentPos < 0) return

    const current = items[currentPos]

    // find the current movement's work header (only set for classical rows)
    let headerPos = -1
    if (current.workhash) {
        for (let i = currentPos - 1; i >= 0; i--) {
            if (items[i].workhash !== current.workhash) break
            if (items[i].isHeader) {
                headerPos = i
                break
            }
        }
    }

    if (headerPos < 0) {
        // normal tracks: one row above the current track
        scroller.value?.scrollToItem(Math.max(currentPos - show_above, 0))
        return
    }

    // classical: geometry from measured sizes, since header heights vary
    let headerTop = 0
    for (let i = 0; i < headerPos; i++) headerTop += getItemSize(items[i])

    let currentTop = headerTop
    for (let i = headerPos; i < currentPos; i++) currentTop += getItemSize(items[i])
    const currentBottom = currentTop + getItemSize(items[currentPos])

    // the group runs from the header to the last consecutive same-work movement
    let groupEnd = currentPos
    while (
        groupEnd + 1 < items.length &&
        !items[groupEnd + 1].isHeader &&
        items[groupEnd + 1].workhash === current.workhash
    ) {
        groupEnd++
    }

    let groupHeight = 0
    for (let i = headerPos; i <= groupEnd; i++) groupHeight += getItemSize(items[i])

    const elem = document.getElementById('queue-scrollable')
    const viewTop = elem?.scrollTop ?? 0
    const viewHeight = elem?.clientHeight ?? 0

    // header and current movement already in sight: don't shift anything
    if (headerTop >= viewTop && currentBottom <= viewTop + viewHeight) return

    if (groupHeight <= viewHeight) {
        // whole work fits: pin its header to the top so every movement stays visible
        elem?.scroll({ top: headerTop, behavior: 'smooth' })
    } else {
        // anomaly (work taller than the viewport): focus the current movement
        scroller.value?.scrollToItem(Math.max(currentPos - show_above, 0))
    }
}

onMounted(() => {
    setScrollFunction(scrollToCurrent, mouseover)
    focusCurrentInSidebar()
})

onBeforeUnmount(() => {
    setScrollFunction(() => {}, null)
})
</script>

<style lang="scss">
.queue-virtual-scroller {
    height: 100%;
    overflow: hidden;

    .gap-above {
        padding-top: 1.5rem;
    }
}
</style>
