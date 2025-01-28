<template>
    <CardGridPage :items="page?.items || []">
        <template #header>
            <GenericHeader>
                <template #name>
                    <span @click="updatePage">
                        {{ page?.name }} <span><PencilSvg height="0.8rem" width="0.8rem" /></span
                    ></span>
                </template>
                <template #description v-if="page?.extra.description">
                    <span @click="updatePage"> {{ page?.extra.description }} </span>
                </template>
            </GenericHeader>
        </template>
    </CardGridPage>
</template>

<script setup lang="ts">
import { Page } from '@/interfaces'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPage } from '@/requests/pages'

import CardGridPage from '@/views/SearchView/CardGridPage.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import PencilSvg from '@/assets/icons/pencil.svg'

import useModal from '@/stores/modal'

const modal = useModal()

const page = ref<Page | null>(null)

onMounted(async () => {
    const route = useRoute()
    const page_id = route.params.page as string
    page.value = await getPage(page_id)
    console.log(page.value)
})

function updatePage() {
    console.log('update page')
    modal.showNewPageModal({
        page: page.value,
    })
}
</script>

<style scoped lang="scss">
span {
    cursor: text;
    margin-right: $smaller;
}

.generichead {
    margin-top: 2rem
}
</style>
