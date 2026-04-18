<template>
    <NoItems
        v-if="showNoItemsComponent"
        :title="`No ${page} results`"
        :description="'Results should appear here'"
        :icon="SearchSvg"
        :flag="!items.length"
    />
    <div class="v-scroll-page" style="height: 100%">
        <DynamicScroller style="height: 100%" class="scroller" :min-item-size="64" :items="scrollerItems">
            <template #before>
                <slot name="header"></slot>
            </template>
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :key="item.id"
                    :item="item"
                    :active="active"
                    :size-dependencies="[item.props]"
                    :data-index="index"
                >
                    <component :is="item.component" :key="index" v-bind="item.props"></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { maxAbumCards } from '@/stores/content-width'

import SearchSvg from '@/assets/icons/search.svg'
import NoItems from '@/components/shared/NoItems.vue'
import CardRow from '@/components/shared/CardRow.vue'
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'

const props = defineProps<{
    page?: 'album' | 'artist' | 'mix'
    fetch_callback?: () => Promise<void>
    items: any[]
    outside_route?: boolean
    showNoItemsComponent?: boolean
    moreItems?: boolean
}>()

const scrollerItems = computed(() => {
    let maxCards = maxAbumCards.value

    if (props.outside_route) {
        maxCards = 6
    }

    const groups = Math.ceil(props.items.length / maxCards)
    const items = []

    for (let i = 0; i < groups; i++) {
        items.push({
            id: i,
            component: CardRow,
            props: {
                items: props.items.slice(i * maxCards, (i + 1) * maxCards),
            },
            key: i,
        })
    }

    if (props.fetch_callback && props.moreItems) {
        items.push({
            id: Math.random(),
            component: AlbumsFetcher,
            props: {
                fetch_callback: props.fetch_callback,
                outside_route: props.outside_route,
            },
        })
    }

    return items
})
</script>
