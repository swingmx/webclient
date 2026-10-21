<template>
    <div class="content-page classicalworksview">
        <GenericHeader v-if="page">
            <template #name>{{ title }}</template>
            <template #description>
                {{ $t('Views.ComposerView.WorkCount', { n: page.works.length }, page.works.length) }}
            </template>
        </GenericHeader>
        <WorkList
            v-if="page"
            artisthash=""
            title=""
            :works="page.works"
            :filters="[]"
            filter-key=""
            :filter="null"
            :show-composer="true"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, RouteLocationNormalized, useRoute } from 'vue-router'

import { pageSwitching } from '@/composables/pageCache'
import { useT } from '@/i18n'
import { WorkRow } from '@/interfaces'
import { getClassicalWorks } from '@/requests/classical'
import updatePageTitle from '@/utils/updatePageTitle'

import WorkList from '@/components/Classical/WorkList.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const { t } = useT()
const route = useRoute()
const page = ref<{ title: string | null; works: WorkRow[] } | null>(null)

// titles for the sorted lists, which name no era, instrument, or type
const SORT_TITLES: Record<string, () => string> = {
    added: () => t('Views.ClassicalHome.RecentlyAdded'),
    favorites: () => t('Views.ClassicalHome.FavoriteWorks'),
    plays: () => t('Views.ClassicalHome.ReturnTo'),
}

const title = computed(
    () => page.value?.title || SORT_TITLES[route.query.sort as string]?.() || t('Views.ComposerView.Works')
)

async function load(to: RouteLocationNormalized) {
    page.value = await getClassicalWorks(to.query as Record<string, string>)
    updatePageTitle(title.value)
}

onMounted(() => load(route))
onBeforeRouteUpdate(to => {
    if (!pageSwitching()) load(to)
})
</script>

<style lang="scss">
.classicalworksview {
    height: 100%;
    overflow: auto;
    padding-bottom: 4rem;

    .work-list .heading {
        display: none;
    }
}
</style>
