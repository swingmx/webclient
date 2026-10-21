<template>
    <div class="search-works-view">
        <NoItems
            :title="$t('Common.NoResults')"
            :description="$t('Common.NoSearchResults')"
            :icon="SearchSvg"
            :flag="!search.works.value.length"
        />
        <RecycleScroller
            id="workslist-scroller"
            v-slot="{ item }"
            style="height: 100%"
            :items="scrollerItems"
            :item-size="64"
            key-field="id"
        >
            <component :is="item.component" v-bind="item.props" />
        </RecycleScroller>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import useSearch from '@/stores/search'

import SearchSvg from '@/assets/icons/search.svg'
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'
import SearchWorkRow from '@/components/Classical/SearchWorkRow.vue'
import NoItems from '@/components/shared/NoItems.vue'

const search = useSearch()

const scrollerItems = computed(() => {
    const items: { id: string | number; component: any; props: Record<string, any> }[] = search.works.value.map(
        work => ({
            id: `${work.workhash}-${work.albumhash}`,
            component: SearchWorkRow,
            props: { work },
        })
    )

    if (search.works.more) {
        items.push({
            // set to random to force re-render
            id: Math.random(),
            component: AlbumsFetcher,
            props: {
                fetch_callback: search.loadWorks,
            },
        })
    }

    return items
})
</script>

<style lang="scss">
.search-works-view {
    height: 100%;

    #workslist-scroller {
        padding-left: $padleft;
        padding-right: $padright;
        padding-bottom: 4rem;

        @include allPhones {
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
}
</style>
