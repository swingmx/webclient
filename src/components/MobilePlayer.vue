<template>
    <div
        ref="playerRef"
        class="mobile-player"
        :style="playerStyle"
    >
        <div class="drag-handle"></div>
        
        <DynamicScroller
            ref="scrollerRef"
            :items="scrollerItems"
            :min-item-size="64"
            class="scroller"
            :class="{ isSmall, isMedium }"
            style="height: 100%"
        >
            <template #before>
                <div class="now-playing-header">
                    <div class="centered">
                        <div class="header-row">
                            <button class="close-btn" @click="closePlayer">
                                <ExpandSvg />
                            </button>
                            <PlayingFrom />
                        </div>
                        <div class="np-image">
                            <img v-motion-fade class="rounded" :src="paths.images.thumb.large + queue.currenttrack?.image" />
                        </div>
                        <NowPlayingInfo @handle-fav="handleFav" />
                        <Progress />
                        
                        <div class="time-row">
                            <div class="time">{{ formatSeconds(queue.duration.current) }}</div>
                            <div class="time">{{ formatSeconds(queue.duration.full) }}</div>
                        </div>

                        <div class="controls-row">
                            <button title="Shuffle" @click="queue.shuffleQueue" class="control-btn shuffle">
                                <ShuffleSvg />
                            </button>
                            
                            <div class="hotkeys-wrapper">
                                <HotKeys />
                            </div>
                            
                            <button
                                class="control-btn repeat"
                                :class="{ 'repeat-disabled': settings.repeat == 'none' }"
                                :title="settings.repeat == 'all' ? 'Repeat all' : settings.repeat == 'one' ? 'Repeat one' : 'No repeat'"
                                @click="settings.toggleRepeatMode"
                            >
                                <RepeatOneSvg v-if="settings.repeat == 'one'" />
                                <RepeatAllSvg v-else />
                            </button>
                        </div>
                        <h3 class="nowplaying_title" v-if="queue.next">Up Next</h3>
                        <SongItem
                            v-if="queue.next"
                            :track="queue.next"
                            :index="queue.nextindex + 1"
                            :source="dropSources.folder"
                            @play-this="queue.playNext"
                        />
                        <h3 class="nowplaying_title">Queue</h3>
                    </div>
                </div>
            </template>
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[item.props]"
                    :data-index="index"
                >
                    <component
                        :is="item.component"
                        :key="index"
                        v-bind="item.props"
                        @playThis="playFromQueue(item.props.index - 1)"
                    ></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { Routes } from '@/router'
import { paths } from '@/config'
import { dropSources, favType } from '@/enums'
import favoriteHandler from '@/helpers/favoriteHandler'
import { isMobilePlayerOpen, isSmall, isMedium } from '@/stores/content-width'
import useLyrics from '@/stores/lyrics'
import useQueueStore from '@/stores/queue'
import useSettingsStore from '@/stores/settings'
import useTracklist from '@/stores/queue/tracklist'
import { formatSeconds } from '@/utils'
import { ScrollerItem } from '@/interfaces'

import Progress from '@/components/LeftSidebar/NP/Progress.vue'
import SongItem from '@/components/shared/SongItem.vue'
import NowPlayingInfo from '@/components/NowPlaying/NowPlayingInfo.vue'
import PlayingFrom from '@/components/NowPlaying/PlayingFrom.vue'
import HotKeys from '@/components/LeftSidebar/NP/HotKeys.vue'
import ExpandSvg from '@/assets/icons/expand.svg'
import ShuffleSvg from '@/assets/icons/shuffle.svg'
import RepeatAllSvg from '@/assets/icons/repeat.svg'
import RepeatOneSvg from '@/assets/icons/repeat-one.svg'

const route = useRoute()
const queue = useQueueStore()
const lyrics = useLyrics()
const settings = useSettingsStore()
const store = useTracklist()

watch(() => queue.currenttrackhash, (newHash) => {
    if (newHash && queue.currenttrack?.trackhash) {
        lyrics.checkExists(queue.currenttrack.filepath, queue.currenttrack.trackhash)
    }
}, { immediate: true })

watch(() => route.name, (newName) => {
    if (newName === Routes.Lyrics) {
        isMobilePlayerOpen.value = false
    }
})
const playerRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<any>(null)
const { height } = useWindowSize()

// Logic for manual simple drag/swipe
const offset = ref(0)
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)

const closePlayer = () => {
    isMobilePlayerOpen.value = false
}

function handleFav() {
    favoriteHandler(
        queue.currenttrack?.is_favorite,
        favType.track,
        queue.currenttrack?.trackhash || '',
        () => null,
        () => null
    )
}

function playFromQueue(index: number) {
    queue.play(index)
}

const scrollerItems = computed(() => {
    const items: ScrollerItem[] = []
    
    // We only show the queue tracks here (not Up Next, because that's in the header)
    // Wait, NowPlaying view logic: Up Next is queue.next.
    // The list in NowPlaying view usually starts from specific point?
    // main.vue: store.tracklist.map...
    // store.tracklist usually contains the current context tracks.
    // If I map ALL tracks, I get the whole list.
    // I should filter? No, standard view shows all.
    
    // HOWEVER, I already render queue.next manually in the header.
    // I should probably ensure the list here reflects what the user expects.
    // If I just show the full list, it's fine.
    
    const trackComponents = store.tracklist.map((track, index) => {
        track.index = index;
        return {
            id: index, // Use index or trackhash? index is used in main.vue
            component: SongItem,
            props: {
                track,
                index: index + 1,
                isCurrent: index === queue.currentindex,
                isCurrentPlaying: index === queue.currentindex && queue.playing,
                isQueueTrack: true,
                source: store.from.type,
            },
        };
    });

    return items.concat(trackComponents);
});

// Touch Handling manually for full control
const onTouchStart = (e: TouchEvent) => {
    // If scrolling, don't drag sheet
    // DynamicScroller root element is what scrolls? 
    // scrollerRef.$el is likely the .vue-recycle-scroller element.
    if (scrollerRef.value && scrollerRef.value.$el.scrollTop > 5) return

    isDragging.value = true
    startY.value = e.touches[0].clientY
    currentY.value = startY.value
}

const onTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return
    currentY.value = e.touches[0].clientY
    const delta = currentY.value - startY.value
    
    // Only allow dragging down (positive delta)
    if (delta > 0) {
        offset.value = delta
         if(e.cancelable) e.preventDefault();
    }
}

const onTouchEnd = () => {
    isDragging.value = false
    if (offset.value > height.value * 0.2) {
        closePlayer()
    }
    offset.value = 0
}

watch(playerRef, (el) => {
    if (el) {
        el.addEventListener('touchstart', onTouchStart, { passive: false })
        el.addEventListener('touchmove', onTouchMove, { passive: false })
        el.addEventListener('touchend', onTouchEnd)
    }
})

const playerStyle = computed(() => {
    const transform = isMobilePlayerOpen.value 
        ? `translateY(${offset.value}px)` 
        : `translateY(100%)`
    return {
        transform,
        transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
    }
})

</script>

<style lang="scss" scoped>
.mobile-player {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    height: 100dvh;
    background-color: var(--color-bg, #000); 
    background: $black; 
    z-index: 9999;
    overflow: hidden;
    overflow-x: hidden;
    will-change: transform;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
}

.drag-handle {
    width: 40px;
    height: 5px;
    background-color: $gray3;
    border-radius: 99px;
    margin: 0.75rem auto;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}

.scroller {
    width: 100%;
    height: 100%;
    padding: 0 1.25rem;
    box-sizing: border-box;
}

.now-playing-header {
    padding-bottom: $smaller;
    padding-top: 1.5rem;
    
    .header-row {
        display: grid !important;
        grid-template-columns: 3rem 1fr 3rem !important;
        align-items: center;
        margin-bottom: 2rem;
        width: 100%;

        .close-btn {
            background: transparent;
            border: none;
            padding: 0;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: start;
            
            svg {
                transform: rotate(90deg);
                width: 1.5rem;
                height: 1.5rem;
            }
        }
    }

    :deep(.now-playing-top) {
        display: contents !important;
    }

    :deep(.now-playling-from-link) {
        grid-column: 2;
        justify-self: center;
        max-width: 100%;
        overflow: hidden;
        margin: 0 !important;
        
        .from {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
        }
    }

    :deep(.options) {
        grid-column: 3;
        justify-self: end;
        background: transparent !important;
        border: none;
        padding: 0;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        
        svg {
            transform: scale(1.25) rotate(90deg) !important;
        }
    }

    .centered {
        margin: 0 auto;
        width: 100%;
        max-width: 500px;
    }

    .np-image {
        position: relative;
        margin-bottom: 2rem;

        img {
            width: 100%;
            height: auto;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: $medium;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
    }
    
    .time-row {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        font-size: 0.95rem;
        font-weight: 500;
        color: $gray1;
        font-variant-numeric: tabular-nums;
    }

    .controls-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        margin-bottom: 2rem;
        width: 100%;
        box-sizing: border-box;

        .control-btn {
            background: transparent;
            border: none;
            padding: 0;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            
            &.repeat-disabled {
                opacity: 0.5;
            }
            
            svg {
                width: 1.5rem;
                height: 1.5rem;
            }
        }

        .hotkeys-wrapper {
            flex: 1;
            min-width: 0;

            :deep(.hotkeys) {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                
                button {
                    margin: 0 !important;
                    padding: 0 !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    background: transparent !important;
                    width: 100% !important;
                    height: 3rem !important;

                    svg {
                        transform: scale(1.1); 
                    }
                }

                button:nth-child(2) svg { 
                    transform: scale(1.4);
                }
                
                button:first-child svg {
                     transform: rotate(180deg) scale(1.1);
                }
            }
        }
    }
    
    :deep(#progress) {
        width: 100%;
        margin-top: 1.25rem;
    }
    
    .nowplaying_title {
        margin: 1.25rem 0;
        font-size: 1.1rem;
        font-weight: bold;

        &:last-child {
            padding-top: $large;
            margin: 1rem 0;
        }
    }
}

:deep(.now-playing-info) {
    min-width: 0;
    align-items: center !important;
    
    .text {
        min-width: 0;
        overflow: hidden;
    }

    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 2px;
    }
}

// Mobile Queue Item Overrides
:deep(.songlist-item) {
    max-width: 500px;
    overflow: hidden;
    grid-template-columns: 2fr 3.5rem !important;
    width: 100%;
    box-sizing: border-box;
    
    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
