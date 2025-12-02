<template>
    <div class="now-playing-view content-page" :class="{ isSmall, isMedium }" style="height: 100%">
        <div class="now-playing-content rounded">
            <div
                class="npbgimage"
                :style="{
                    backgroundImage: `url(${paths.images.thumb.small + queue.currenttrack?.albumhash + '.webp'})`,
                }"
            ></div>
            <!-- Whatever the f**k this is!! -->
            <div
                class="npbggradient"
                :style="{
                    background: `linear-gradient(16deg, #000a 2%, #000 60%, ${
                        // top right
                        rgba(darkVibrant, 0.25)
                    }), linear-gradient(-35deg, ${
                        // bottom right
                        // rgba(colors.darkVibrant, 0.85)
                        '#000'
                    } 10%, 
                    ${
                        // center to top right
                        rgba(colors.darkMuted, 0.75) || '#000000'
                    } 60%, ${
                        //  top left
                        rgba(darkVibrant, 0.25)
                    })`,
                }"
            ></div>
            <component :is="routeMap[$route.params.tab as keyof typeof routeMap]" class="np-route-view"> </component>
        </div>
        <!-- <div class="tracklist">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut repudiandae accusamus dolorum impedit sapiente deleniti deserunt magni repellendus, aperiam ducimus accusantium esse quas. Repellendus id enim atque quaerat minus distinctio?
        </div> -->
        <!-- <DynamicScroller :items="scrollerItems" :min-item-size="64" class="scroller" style="height: 100%">
            <template #before> </template>
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
        </DynamicScroller> -->
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

import { paths } from '@/config'
import useColor from '@/stores/colors'
import useQueueStore from '@/stores/queue'
import { transitionColor } from '@/utils/colortools'
import { isMedium, isSmall } from '@/stores/content-width'

const colors = useColor()
const queue = useQueueStore()

const darkMuted = ref<string>('rgb(0, 0, 0)')
const darkVibrant = ref<string>('rgb(0, 0, 0)')

const routeMap = {
    home: defineAsyncComponent(() => import('@/components/NowPlaying/HomeScreen.vue')),
}

// watch for changes to the colors.darkVibrant using pinia watcher and transition the currentColor to the new color
colors.$subscribe((_mutation, state) => {
    if (darkVibrant.value !== state.darkVibrant) {
        transitionColor(darkVibrant.value, state.darkVibrant, 5000, color => {
            darkVibrant.value = color
        })

        if (darkMuted.value !== state.darkMuted) {
            transitionColor(darkMuted.value, state.darkMuted, 5000, color => {
                darkMuted.value = color
            })
        }
    }
})

/**
 * Converts a color string to an rgba string
 * Example: rgb(255, 255, 255) -> rgba(255, 255, 255, 1)
 * @param color - The color to convert to rgba
 * @param transparency - The amount of transparency to add
 * @returns The rgba color string
 */
function rgba(color: string, transparency: number) {
    return color.replace('rgb', 'rgba').replace(')', `, ${transparency})`)
}

// function playFromQueue(index: number) {
//     queue.play(index)
// }

// const scrollerItems = computed(() => {
//     const items: ScrollerItem[] = []

//     const trackComponents = store.tracklist.map((track, index) => {
//         track.index = index // used in context menu to remove from queue
//         return {
//             id: index,
//             component: SongItem,
//             props: {
//                 track,
//                 index: index + 1,
//                 isCurrent: index === queue.currentindex,
//                 isCurrentPlaying: index === queue.currentindex && queue.playing,
//                 isQueueTrack: true,
//                 source: store.from.type,
//             },
//         }
//     })

//     return items.concat(trackComponents)
// })
</script>

<style lang="scss">
.now-playing-view .now-playing-content {
    // umm ... I think there's a padding 4rem on parent
    height: calc(100% + 2rem);
    justify-content: center;
    overflow: hidden;
    position: relative;

    display: grid;
    place-content: center;

    .np-route-view {
        z-index: 10;
    }

    .npbgimage,
    .npbggradient {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .npbgimage {
        background-size: 800px;
        background-position: -10px -10px;

        $brightness: 1;
        $blur-amount: 100px;
        filter: blur($blur-amount) brightness($brightness);
        -webkit-filter: blur($blur-amount) brightness($brightness);
        -moz-filter: blur($blur-amount) brightness($brightness);
        -ms-filter: blur($blur-amount) brightness($brightness);
        -o-filter: blur($blur-amount) brightness($brightness);
    }

    .npbggradient {
        background-color: transparent;
    }
}
</style>
