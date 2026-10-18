<template>
    <div v-if="kind.page === 'work'" class="content-page favworksview" @scroll="onScroll">
        <GenericHeader>
            <template #name>
                {{ $t('Views.FavCardScroller.Title', { item: kind.title() }) }}
            </template>
            <template #description>
                {{ $t('Views.FavCardScroller.Desc', { nelem: count, type: kind.unit(count) }, count) }}
            </template>
        </GenericHeader>
        <WorkList
            artisthash=""
            title=""
            :works="items"
            :filters="[]"
            filter-key=""
            :filter="null"
            :show-composer="true"
            :compact="true"
        />
    </div>
    <CardGridPage v-else :page="kind.page" :items="items" :fetch_callback="() => loadMore()" :more-items="waitingForMore">
        <template #header>
            <GenericHeader>
                <template #name>
                    {{ $t('Views.FavCardScroller.Title', { item: kind.title() }) }}
                </template>
                <template #description>
                    {{ $t('Views.FavCardScroller.Desc', { nelem: count, type: kind.unit(count) }, count) }}
                </template>
            </GenericHeader>
        </template>
    </CardGridPage>
</template>

<script setup lang="ts">
import { Routes } from '@/router'
import { useRoute } from 'vue-router'
import { computed, onMounted, Ref, ref } from 'vue'

import { useT } from '@/i18n'
import { getFavAlbums, getFavArtists, getFavComposers, getFavWorks } from '@/requests/favorite'

import CardGridPage from './SearchView/CardGridPage.vue'
import WorkList from '@/components/Classical/WorkList.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const { t } = useT()
const route = useRoute()

// each favorites grid: its card type, titles, request, and the response key
const KINDS: Record<string, any> = {
    [Routes.favoriteAlbums]: {
        page: 'album',
        title: () => t('Common.Album', 2),
        unit: (n: number) => t('Common.album', n),
        fetch: getFavAlbums,
        key: 'albums',
    },
    [Routes.favoriteArtists]: {
        page: 'artist',
        title: () => t('Common.Artist', 2),
        unit: (n: number) => t('Common.artist', n),
        fetch: getFavArtists,
        key: 'artists',
    },
    [Routes.favoriteWorks]: {
        page: 'work',
        title: () => t('Views.Favorites.Works'),
        unit: (n: number) => t('Views.Favorites.Work', n),
        fetch: getFavWorks,
        key: 'works',
    },
    [Routes.favoriteComposers]: {
        page: 'artist',
        title: () => t('Views.Favorites.Composers'),
        unit: (n: number) => t('Views.Favorites.Composer', n),
        fetch: getFavComposers,
        key: 'composers',
    },
}

const kind = computed(() => KINDS[route.name as string] ?? KINDS[Routes.favoriteAlbums])

const count = ref(0)
const items: Ref<any[]> = ref([])

const waitingForMore = computed(() => count.value > 0 && items.value.length < count.value)

async function loadMore(initialize?: boolean) {
    if (!initialize && !waitingForMore.value) return

    // start at the end of the current items
    const limit = 50
    const data = await kind.value.fetch(items.value.length, limit)

    if (data.total !== -1) {
        count.value = data.total
    }

    // grid rows pick their card by `type`
    items.value.push(...data[kind.value.key].map((item: any) => ({ ...item, type: item.type ?? kind.value.page })))
}

/**
 * Load the next page of works when the list nears its end.
 */
let fetching = false

function onScroll(event: Event) {
    const el = event.target as HTMLElement
    if (fetching || el.scrollHeight - el.scrollTop - el.clientHeight >= 400) return
    fetching = true
    loadMore().finally(() => (fetching = false))
}

onMounted(async () => {
    await loadMore(true)
})
</script>

<style lang="scss">
.favworksview {
    height: 100%;
    overflow: auto;
    padding-bottom: 4rem;

    .work-list .heading {
        display: none;
    }
}
</style>
