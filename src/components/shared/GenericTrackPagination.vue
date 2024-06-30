<template>
    <div class="v-scroll-page" :class="{ isSmall }" style="height: 100%">
        <NoItems :flag="!tracks.length" :title="'No tracks'" :description="desc" :icon="noitemsicon" />
        <DynamicScroller
            id="album-scroller"
            style="height: 100%"
            class="scroller"
            :min-item-size="64"
            :items="scrollerItems"
        >
            <template #before>
                <slot name="header"></slot>
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
                        @playThis="$emit('playThis', item.props.track.master_index)"
                    ></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import { Track } from '@/interfaces'
import { isSmall } from '@/stores/content-width'

import NoItems from '@/components/shared/NoItems.vue'
import SongItem from '@/components/shared/SongItem.vue'
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'
import { dropSources } from '@/enums'

const props = defineProps<{
    tracks: Track[]
    desc: string
    noitemsicon: any
    moreItemsLoader: () => Promise<void>
}>()

defineEmits<{
    (e: 'playThis', index: number): void
}>()

interface scrollerItem {
    id: string | number | undefined
    component: typeof SongItem | typeof AlbumsFetcher
    props: Record<string, any>
}

const scrollerItems = computed(() => {
    const items: scrollerItem[] = props.tracks.map((track, index) => ({
        id: index,
        component: SongItem,
        props: {
            track,
            index: track.index,
            source: dropSources.favorite,
        },
    }))

    items.push({
        // set to random to force re-render
        id: Math.random(),
        component: AlbumsFetcher,
        props: {
            fetch_callback: props.moreItemsLoader,
        },
    })

    return items
})
</script>

<style lang="scss">
.generic-tracks-view {
    border: solid;
}
</style>
