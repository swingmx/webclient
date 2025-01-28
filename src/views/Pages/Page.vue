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
                <template #right>
                    <button @click="deletePage"><DeleteSvg height="1.2rem" width="1.2rem" /> Delete</button>
                </template>
            </GenericHeader>
        </template>
    </CardGridPage>
</template>

<script setup lang="ts">
import { Page } from '@/interfaces'
import { getPage } from '@/requests/pages'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import DeleteSvg from '@/assets/icons/delete.svg'
import PencilSvg from '@/assets/icons/pencil.svg'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import CardGridPage from '@/views/SearchView/CardGridPage.vue'

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
    modal.showPageModal({
        page: page.value,
    })
}

function deletePage() {
    modal.showPageModal({
        page: page.value,
        delete: true,
    })
}
</script>

<style scoped lang="scss">
span {
    cursor: text;
    margin-right: $smaller;
}

.generichead {
    margin-top: 2rem;
}
</style>
