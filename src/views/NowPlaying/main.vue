<template>
    <div v-if="$route.params.tab == 'home'" class="now-playing-view content-page" :class="{ isSmall, isMedium }">
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
                    background: `linear-gradient(16deg, #000a 2%, transparent 70%, ${
                        // top right
                        rgba(colors.darkVibrant, 0.25)
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
                        rgba(colors.darkVibrant, 0.25)
                    })`,
                }"
            ></div>
            <Header :source="store.from" />
            <div class="queuetracks">
                <div></div>
                <div class="queue-content">
                    <Queue />
                </div>
                <div></div>
            </div>
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
import { computed, onMounted } from 'vue'
import { ScrollerItem } from '@/interfaces'

import { paths } from '@/config'
import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import useColor from '@/stores/colors'
import { isMedium, isSmall } from '@/stores/content-width'

import Header from '@/components/NowPlaying/Header.vue'
import SongItem from '@/components/shared/SongItem.vue'
import updatePageTitle from '@/utils/updatePageTitle'
import Queue from '@/components/RightSideBar/Queue.vue'

const queue = useQueueStore()
const store = useTracklist()
const colors = useColor()

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

function playFromQueue(index: number) {
    queue.play(index)
}

const scrollerItems = computed(() => {
    const items: ScrollerItem[] = []

    const trackComponents = store.tracklist.map((track, index) => {
        track.index = index // used in context menu to remove from queue
        return {
            id: index,
            component: SongItem,
            props: {
                track,
                index: index + 1,
                isCurrent: index === queue.currentindex,
                isCurrentPlaying: index === queue.currentindex && queue.playing,
                isQueueTrack: true,
                source: store.from.type,
            },
        }
    })

    return items.concat(trackComponents)
})

onMounted(() => updatePageTitle('Now Playing'))
</script>

<style lang="scss">
.now-playing-view {
    height: 100%;
    // background-color: red;

    // gap: 2rem;

    .now-playing-content {
        // umm ... I think there's a padding 4rem on parent
        height: calc(100% + 2rem);
        display: grid;
        grid-template-columns: 32rem 32rem;
        gap: 4rem;
        justify-content: center;
        overflow: hidden;
        position: relative;
        // border: solid 1px $gray;
        // border: solid;

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
            // background: linear-gradient(-35deg, rgb(#3a4458, 1) 20%, rgb(#3a4458, 1) 60%, rgb(transparent, 0));
            // linear-gradient(-37deg, $gray, $gray5, $gray);
        }

        // TODO: Use two divs to create the gradient/blur effect
        // Lower div to background image, then blur it
        // Upper div to render gradient of grayish with one corner being transparent to expose the background image
        // Achieve a combo of only a small area being blurred, while the rest of the area has the gradient
    }

    .queuetracks {
        display: grid;
        grid-template-rows: 1fr 32rem 1fr;
        z-index: 1;

        .queue-content {
            display: grid;
            grid-template-rows: max-content 1fr;
        }

        // force show remove from queue button
        .track-item {
            .float-buttons {
                opacity: 1;

                .heart-button {
                    opacity: 0;
                }

                .favorited {
                    opacity: 1 !important;
                }
            }

            &:hover {
                .heart-button {
                    opacity: 1 !important;
                }
            }
        }
    }

    #queue-scrollable {
        padding: 1rem 1.5rem 0rem 0 !important;
    }
}
</style>
