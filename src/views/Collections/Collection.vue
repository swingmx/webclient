<template>
    <CardGridPage :items="collection.collection?.items || []">
        <template #header>
            <GenericHeader v-if="collection.collection?.id">
                <template #name>
                    <span @click="updatePage">
                        {{ collection.collection?.name }} <span><PencilSvg height="0.8rem" width="0.8rem" /></span
                    ></span>
                </template>
                <template #description v-if="collection.collection?.extra.description">
                    <span @click="updatePage"> {{ collection.collection?.extra.description }} </span>
                </template>
                <template #right>
                    <button @click="deletePage"><DeleteSvg height="1.2rem" width="1.2rem" /> Delete</button>
                </template>
            </GenericHeader>
        </template>
    </CardGridPage>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import DeleteSvg from '@/assets/icons/delete.svg'
import PencilSvg from '@/assets/icons/pencil.svg'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import CardGridPage from '@/views/SearchView/CardGridPage.vue'

import useModal from '@/stores/modal'
import useCollection from '@/stores/pages/collections'

const modal = useModal()
const collection = useCollection()

onMounted(async () => {
    const route = useRoute()
    const collection_id = route.params.collection as string
    collection.fetchCollection(collection_id)
})

function updatePage() {
    modal.showCollectionModal({
        collection: collection.collection,
    })
}

function deletePage() {
    modal.showCollectionModal({
        collection: collection.collection,
        delete: true,
    })
}

onBeforeUnmount(() => {
    collection.clearStore()
})
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
