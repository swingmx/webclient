<template>
    <div class="folder-view v-scroll-page" style="height: 100%" :class="{ isSmall, isMedium }" v-if="mix.title">
        <DynamicScroller
            id="contentscroller"
            :items="scrollerItems"
            :min-item-size="64"
            class="scroller"
            style="height: 100%"
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
                        :key="index"
                        v-bind="item.props"
                        @playThis="handlePlay(item.props.index ? item.props.index - 1 : 0)"
                    ></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
    <div v-if="!loading && !mix.title" class="content-page">
        <h1>404: Mix not found</h1>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onMounted } from 'vue'

import { isMedium, isSmall, isSmallPhone } from '@/stores/content-width'
import { dropSources } from '@/enums'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'

import updatePageTitle from '@/utils/updatePageTitle'

import SongItem from '@/components/shared/SongItem.vue'
import AfterHeader from '@/components/PlaylistView/AfterHeader.vue'
import { useRoute } from 'vue-router'
import { FullMix } from '@/interfaces'
import { getMix } from '@/requests/mixes'
import MixesHeader from '@/components/Mixes/MixesHeader.vue'

const queue = useQueue()
const tracklist = useTracklist()
const route = useRoute()

interface ScrollerItem {
    id: string | number
    component: typeof SongItem | typeof AfterHeader | typeof MixesHeader
    size: number
    props?: {}
}

function handlePlay(index: number) {
    tracklist.setFromMix(
        mix.extra.type === 'artist' ? mix.title : mix.title + ' Radio',
        mix.id,
        mix.tracks,
        mix.extra.type === 'artist' ? mix.sourcehash : mix.extra.og_sourcehash,
        mix.extra.type === 'artist'
            ? { type: 'mix', image: mix.extra.image?.image || '' }
            : { type: 'track', image: mix.extra.images?.[0]?.image || '' }
    )
    queue.play(index)
}

const loading = ref(false)
const mix = reactive(<FullMix>{})

const scrollerItems = computed(() => {
    const header: ScrollerItem = {
        id: 'header',
        component: MixesHeader,
        size: isSmallPhone.value ? 24 * 16 : 18 * 16,
        props: {
            mix: mix,
        },
    }

    const afterHeader: ScrollerItem = {
        id: 'afterHeader',
        component: AfterHeader,
        size: 4 * 16,
    }

    const tracks = (mix.tracks || []).map((track, index) => {
        return {
            id: Math.random(),
            component: SongItem,
            props: {
                track: track,
                index: index + 1,
                is_last: index === mix.tracks.length - 1,
                droppable: true,
                source: dropSources.playlist,
            },
            size: 64,
        }
    })

    return [header, afterHeader, ...tracks]
})

onMounted(async () => {
    updatePageTitle(mix.title)

    loading.value = true
    await getMix(route.params.mixid as string, route.query.src as string).then(res => {
        for (const key in res.data) {
            // @ts-ignore
            mix[key] = res.data[key]
        }
        loading.value = false
    })
})
</script>

<style lang="scss">
.playlist-virtual-scroller {
    .nothing {
        height: 25rem;
    }
}
</style>
