<template>
    <CardGridPage
        page="mix"
        :items="items"
        :show-no-items-component="false"
        :fetch_callback="fetchMixes"
        :more-items="more"
    >
        <template #header>
            <GenericHeader>
                <template #name>
                    <span class="headtext">{{ $route.params.type }} </span> {{ $t('Views.MixListView.mixes') }}
                </template>
                <template #description>
                    {{ $t('Views.MixListView.MixesBasedOnListening', {n: total + savedItems.length}) }}
                </template>

                <template v-if="savedItems.length" #after>
                    <h2>{{ $t('Views.MixListView.SavedMixes') }}</h2>
                    <div v-for="item in savedItemComponents" :key="item.id">
                        <component :is="item.component" :type="item.props.type" :items="item.props.items" />
                    </div>
                    <h2 v-if="items.length" class="othertitle">{{ $t('Views.MixListView.OtherMixes', {type: $route.params.type}) }}</h2>
                </template>
            </GenericHeader>
        </template>
    </CardGridPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CardGridPage from './SearchView/CardGridPage.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import { Mix } from '@/interfaces'
import { getMixes } from '@/requests/mixes'

import CardRow from '@/components/shared/CardRow.vue'
import { maxAbumCards } from '@/stores/content-width'

const PAGE_SIZE = 50

const items = ref<Mix[]>([])
const savedItems = ref<Mix[]>([])
const total = ref(0)
const more = ref(true)
const route = useRoute()
const type = `${route.params.type}s`

let start = 0
let loading = false

const savedItemComponents = computed(() => {
    const maxCard = maxAbumCards.value
    const groups = Math.ceil(savedItems.value.length / maxCard)
    const items = []

    for (let i = 0; i < groups; i++) {
        items.push({
            id: i,
            component: CardRow,
            props: { type: 'mix', items: savedItems.value.slice(i * maxCard, (i + 1) * maxCard) },
        })
    }

    return items
})

/**
 * Loads the next page of unsaved mixes, and the saved mixes with the first page
 */
async function fetchMixes() {
    if (loading || !more.value) return
    loading = true

    const res = await getMixes(type, start, PAGE_SIZE)
    if (start === 0) savedItems.value = res.saved

    items.value.push(...res.mixes)
    total.value = res.total
    start += PAGE_SIZE
    more.value = start < res.total
    loading = false
}

fetchMixes()
</script>

<style lang="scss">
.generichead {
    .after h2 {
        margin-left: $medium;
        margin-bottom: $small;
        font-size: 1.15rem;
    }

    .after .othertitle {
        margin-bottom: -$small;
    }

    .headtext {
        text-transform: capitalize;
    }
}
</style>
