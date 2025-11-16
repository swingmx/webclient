<template>
    <div v-if="$route.params.tab == 'home'" class="now-playing-view content-page" :class="{ isSmall, isMedium }">
        <Header />
        <div class="queuetracks">
            <Queue />
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

import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import { isMedium, isSmall } from '@/stores/content-width'

import Header from '@/components/NowPlaying/Header.vue'
import SongItem from '@/components/shared/SongItem.vue'
import updatePageTitle from '@/utils/updatePageTitle'
import Queue from '@/components/RightSideBar/Queue.vue'

const queue = useQueueStore()
const store = useTracklist()

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
    display: grid;

    grid-template-columns: auto 1fr;
    // gap: 2rem;

    .queuetracks {
      overflow: hidden;
    }
}
</style>
