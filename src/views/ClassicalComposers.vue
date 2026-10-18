<template>
    <CardGridPage :page="kind.page" :items="items">
        <template #header>
            <GenericHeader>
                <template #name>{{ kind.title() }}</template>
                <template #description>{{ kind.count(items.length) }}</template>
            </GenericHeader>
        </template>
    </CardGridPage>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useT } from '@/i18n'
import { getClassicalAlbums, getClassicalComposers } from '@/requests/classical'
import { Routes } from '@/router'
import updatePageTitle from '@/utils/updatePageTitle'

import CardGridPage from './SearchView/CardGridPage.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const { t } = useT()
const route = useRoute()

// the classical album grid and the composer grid share this view
const KINDS: Record<string, any> = {
    [Routes.classicalComposers]: {
        page: 'artist',
        title: () => t('Views.ClassicalHome.Composers'),
        count: (n: number) => `${n} ${t('Views.Favorites.Composer', n)}`,
        fetch: getClassicalComposers,
    },
    [Routes.classicalAlbums]: {
        page: 'album',
        title: () => t('Views.ClassicalHome.AlbumsTitle'),
        count: (n: number) => t('Views.ClassicalHome.Albums', { n }, n),
        fetch: getClassicalAlbums,
    },
}

const kind = computed(() => KINDS[route.name as string] ?? KINDS[Routes.classicalComposers])
const items: Ref<any[]> = ref([])

async function load() {
    const data = (await kind.value.fetch()) ?? []
    items.value = data.map((item: any) => ({ ...item, type: item.type ?? kind.value.page }))
    updatePageTitle(kind.value.title())
}

onMounted(load)
watch(() => route.name, load)
</script>
