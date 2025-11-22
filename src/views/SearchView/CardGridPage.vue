<template>
    <NoItems
        :title="$t('Views.SearchView.NoResults', {page: page})"
        :description="desc"
        :icon="SearchSvg"
        :flag="!items.length"
        v-if="showNoItemsComponent"
    />
    <div class="v-scroll-page" style="height: 100%">
        <DynamicScroller style="height: 100%" class="scroller" :min-item-size="64" :items="scrollerItems">
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
                    <component :is="item.component" :key="index" v-bind="item.props"></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import useSearchStore from '@/stores/search'
import { maxAbumCards } from '@/stores/content-width'

import SearchSvg from '@/assets/icons/search.svg'
import NoItems from '@/components/shared/NoItems.vue'
import CardRow from '@/components/shared/CardRow.vue'
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    page?: 'album' | 'artist' | 'mix'
    fetch_callback?: () => Promise<void>
    items: any[]
    outside_route?: boolean
    showNoItemsComponent?: boolean
}>()

const search = useSearchStore()

function resolvePage(what: string | undefined): string {
    switch (what){
        case 'album':
            return t('Common.album', 2);
        case 'artist':
            return t('Common.artist', 2);
        case 'mix':
            return t('Common.mix', 2);
        default:
            return "";
    }
}

const desc = computed(() =>
    search.query === ''
        ? t('Views.SearchView.TypeToSearch', {what: resolvePage(props.page)})
        : t('Views.SearchView.ResultsForQuery', {query: search.query})
)

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

    const moreItems = props.page === 'album' ? search.albums.more : search.artists.more

    if (props.fetch_callback && moreItems) {
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
