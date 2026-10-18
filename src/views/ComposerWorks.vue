<template>
    <div class="content-page composerworksview">
        <GenericHeader v-if="page">
            <template #name>{{ $t('Views.ComposerView.Works') }}</template>
            <template #description>
                <RouterLink :to="{ name: Routes.composer, params: { hash: page.composerhash } }">
                    {{ page.name }}
                </RouterLink>
                • {{ $t('Views.ComposerView.WorkCount', { n: page.works.length }, page.works.length) }}
            </template>
        </GenericHeader>
        <ComposerWorks
            v-if="page"
            :composerhash="page.composerhash"
            :works="page.works"
            :categories="page.categories"
            :category="page.category"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

import { useT } from '@/i18n'
import { Routes } from '@/router'
import useComposerStore from '@/stores/pages/composer'
import updatePageTitle from '@/utils/updatePageTitle'

import ComposerWorks from '@/components/Classical/ComposerWorks.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const { t } = useT()
const route = useRoute()
const store = useComposerStore()
const page = computed(() => store.works)

async function load(hash: string, category?: string) {
    await store.fetchWorks(hash, category)
    if (page.value) updatePageTitle(`${t('Views.ComposerView.Works')} - ${page.value.name}`)
}

onMounted(() => load(route.params.hash as string, (route.query.category as string) || undefined))
onBeforeRouteUpdate(to => load(to.params.hash as string, (to.query.category as string) || undefined))
</script>

<style lang="scss">
.composerworksview {
    height: 100%;
    overflow: auto;
    padding-bottom: 4rem;

    .composer-works .heading .title {
        display: none;
    }

    .composer-works .heading {
        justify-content: flex-start;
    }
}
</style>
