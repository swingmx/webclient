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
        <VirtualList
            id="queue-scrollable"
            ref="scroller"
            class="scroller"
            style="height: 100%"
            :model-value="scrollerItems"
            data-key="id"
            :size="itemHeight"
            lock-axis="x"
            append-to-body
            :class="{ dragging }"
            ghost-class="queue-drag-ghost"
            placeholder-class="queue-drag-placeholder"
            :ghost-style="{ opacity: '1' }"
            @drag="dragging = true"
            @drop="onDrop"
        >
            <template #item="{ item }">
                <div class="queue-row" :class="{ 'gap-above': item.gapAbove, grip }">
                    <div v-if="grip" class="drag-handle">
                        <svg viewBox="0 0 10 16" width="10" height="16" fill="currentColor">
                            <circle cx="2" cy="2" r="1.5" />
                            <circle cx="8" cy="2" r="1.5" />
                            <circle cx="2" cy="8" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="2" cy="14" r="1.5" />
                            <circle cx="8" cy="14" r="1.5" />
                        </svg>
                    </div>
                    <component
                        :is="item.component"
                        v-if="item.isHeader"
                        v-bind="item.props"
                        :is-current="item.trackIndex !== undefined && item.trackIndex === queue.currentindex"
                        @playThis="playFromQueue(item.playIndex)"
                    />
                    <component
                        :is="item.component"
                        v-else
                        v-bind="item.props"
                        :is-current="item.trackIndex === queue.currentindex"
                        :is-current-playing="item.trackIndex === queue.currentindex && queue.playing"
                        @playThis="playFromQueue(item.trackIndex)"
                    ></component>
                </div>
            </template>
        </VirtualList>
    </div>
</template>

<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, ref } from 'vue'
import VirtualList from 'vue-virtual-sortable'

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

defineProps<{ grip?: boolean }>()

interface QueueScrollerItem {
    id: string
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

;[TrackItem, QueueWorkHead, QueueMovement].forEach(markRaw)

const itemHeight = 64

const queue = useQStore()
const store = useTracklist()
const mouseover = ref(false)
const dragging = ref(false)
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
                id: `t-${index}`,
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
            id: `t-${index}`,
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

function onDrop({ item, list, newIndex, changed }: { item: QueueScrollerItem; list: QueueScrollerItem[]; newIndex: number; changed: boolean }) {
    dragging.value = false
    if (!changed) return

    const from = item.isHeader ? item.playIndex! : item.trackIndex!
    const count = item.isHeader ? item.props.count : 1
    const next = list[newIndex + 1]
    const to = next ? (next.isHeader ? next.playIndex! : next.trackIndex!) : store.tracklist.length

    store.moveTracks(from, count, to)
}

function playFromQueue(index?: number) {
    if (index === undefined) return
    queue.play(index)
}

const show_above = 1 // the number of tracks to show above the current track

// measured row heights from the VirtualList (keyed by item id),
// falling back to min-item-size for rows not measured yet
function getItemSize(item: QueueScrollerItem): number {
    const size = Number(scroller.value?.getSize(item.id))
    return size > 0 ? size : itemHeight
}

function scrollToPos(pos: number) {
    const elem = document.getElementById('queue-scrollable')
    if (!elem) return

    let top = 0
    for (let i = 0; i < pos; i++) top += getItemSize(scrollerItems.value[i])

    const near = Math.abs(top - elem.scrollTop) <= elem.clientHeight * 2
    elem.scroll({ top, behavior: near ? 'smooth' : 'auto' })
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
        scrollToPos(Math.max(currentPos - show_above, 0))
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
        scrollToPos(Math.max(currentPos - show_above, 0))
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
.queue-row.grip {
    display: grid;
    grid-template-columns: 1rem minmax(0, 1fr);
    align-items: center;
    gap: $small;

    &:hover .drag-handle {
        opacity: 0.6;
    }
}

.drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 2rem;
    cursor: grab;
    opacity: 0;
    color: $white;
    transition: opacity 0.2s ease-out;
    touch-action: none;

    &:hover {
        opacity: 1 !important;
    }

    @media (hover: none) {
        opacity: 0.4;
    }
}

.queue-drag-ghost {
    z-index: 100000 !important;
    background-color: $gray4;
    border-radius: $small;
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.5);

    .track-item,
    .row {
        background-color: transparent !important;
    }

    .drag-handle {
        opacity: 1;
    }
}

.queue-drag-placeholder {
    visibility: hidden;
}

.dragging [role='item'] > * {
    pointer-events: none;
}

.queue-virtual-scroller {
    height: 100%;
    overflow: hidden;

    #queue-scrollable {
        scrollbar-gutter: stable;
    }

    .gap-above {
        padding-top: 1.5rem;
    }
}
</style>
