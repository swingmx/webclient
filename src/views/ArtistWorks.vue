<template>
    <div class="content-page artistworksview">
        <GenericHeader v-if="page">
            <template #name>
                {{ page.type === 'composer' ? $t('Views.ComposerView.Works') : $t('Views.ComposerView.Repertoire') }}
            </template>
            <template #description>
                <RouterLink :to="{ name: Routes.artist, params: { hash: page.artisthash } }">
                    {{ page.name }}
                </RouterLink>
                • {{ $t('Views.ComposerView.WorkCount', { n: page.works.length }, page.works.length) }}
            </template>
        </GenericHeader>
        <WorkList
            v-if="page"
            :artisthash="page.artisthash"
            title=""
            :works="page.works"
            :filters="page.filters"
            :filter-key="page.filter_key"
            :filter="page.filter"
            :show-composer="page.type === 'performer'"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, RouteLocationNormalized, useRoute } from 'vue-router'

import { useT } from '@/i18n'
import { ClassicalPersonWorks } from '@/interfaces'
import { getArtistWorks } from '@/requests/artists'
import { Routes } from '@/router'
import updatePageTitle from '@/utils/updatePageTitle'

import WorkList from '@/components/Classical/WorkList.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const { t } = useT()
const route = useRoute()
const page = ref<ClassicalPersonWorks | null>(null)

async function load(to: RouteLocationNormalized) {
    page.value = await getArtistWorks(to.params.hash as string, to.query as Record<string, string>)
    if (page.value) updatePageTitle(`${t('Views.ComposerView.Works')} - ${page.value.name}`)
}

onMounted(() => load(route))
onBeforeRouteUpdate(to => load(to))
</script>

<style lang="scss">
.artistworksview {
    height: 100%;
    overflow: auto;
    padding-bottom: 4rem;

    .work-list .heading .title {
        display: none;
    }

    .work-list .heading {
        justify-content: flex-start;
    }
}
</style>
