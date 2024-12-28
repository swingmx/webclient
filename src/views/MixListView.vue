<template>
    <CardGridPage page="mix" :items="items" :showNoItemsComponent="false">
        <template #header>
            <GenericHeader>
                <template #name>
                    <span class="headtext">{{ $route.params.type }}</span> mixes
                </template>
                <template #description>
                    {{ items.length + savedItems.length }} mixes • Based on artists you have been listening to
                </template>

                <template #after v-if="savedItems.length">
                    <h2>Saved mixes</h2>
                    <div v-for="item in savedItemComponents" :key="item.id">
                        <component :is="item.component" :type="item.props.type" :items="item.props.items" />
                    </div>
                    <h2 class="othertitle" v-if="items.length">Other {{ $route.params.type }} mixes</h2>
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
import useAxios from '@/requests/useAxios'
import { paths } from '@/config'

import CardRow from '@/components/shared/CardRow.vue'
import { maxAbumCards } from '@/stores/content-width'

const items = ref<Mix[]>([])
const savedItems = ref<Mix[]>([])
const route = useRoute()

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

useAxios({
    url: paths.api.mixes + `/${route.params.type}s`,
    method: 'GET',
}).then(res => {
    const { saved, other } = res.data.reduce(
        (acc: { saved: Mix[]; other: Mix[] }, mix: Mix) => {
            acc[mix.saved ? 'saved' : 'other'].push(mix)
            return acc
        },
        { saved: [], other: [] }
    )

    savedItems.value = saved
    items.value = other
})
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
