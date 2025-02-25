<template>
    <form action="" v-if="delete">
        <br>
        <div>Are you sure you want to delete this collection?</div>
        <br />
        <button @click.prevent="submit" class="critical">Yes, Delete</button>
    </form>
    <form class="playlist-modal" @submit.prevent="submit" v-else>
        <label for="name">Collection name</label>
        <br />
        <input type="search" class="rounded-sm" id="name" :value="collection?.name" />
        <br />
        <label for="description">Description</label>
        <br />
        <input type="search" class="rounded-sm" id="description" :value="collection?.extra.description" />
        <br /><br />
        <button type="submit">{{ collection ? 'Update' : 'Create' }}</button>
    </form>
</template>

<script setup lang="ts">
import { Collection } from '@/interfaces'
import { createNewCollection, deleteCollection, updateCollection } from '@/requests/collections'
import { router } from '@/router'
import { NotifType, Notification } from '@/stores/notification'

const props = defineProps<{
    collection?: Collection
    hash?: string
    type?: string
    extra?: any
    delete?: boolean
}>()

const emit = defineEmits<{
    (e: 'hideModal'): void
    (e: 'setTitle', title: string): void
}>()

emit('setTitle', (props.collection ? (props.delete ? 'Delete' : 'Update') : 'New') + ' Collection')

async function submit(e: Event) {
    if (props.delete && props.collection) {
        const deleted = await deleteCollection(props.collection.id)
        if (deleted) {
            new Notification('Collection deleted', NotifType.Success)
            emit('hideModal')
            router.push('/')
        }
        return
    }

    e.preventDefault()
    const name = (e.target as any).elements['name'].value
    const description = (e.target as any).elements['description'].value

    // If the page is null, we are creating a new page
    if (props.collection == null) {
        const created = await createNewCollection(name, description, [
            {
                hash: props.hash as string,
                type: props.type as string,
                extra: props.extra,
            },
        ])

        if (created) {
            new Notification('New page created', NotifType.Success)
            emit('hideModal')
        }
    } else {
        const updatedPage = await updateCollection(props.collection, name, description)

        if (updatedPage) {
            props.collection.name = updatedPage.name
            props.collection.extra.description = updatedPage.extra.description
            new Notification('Page updated', NotifType.Success)
            emit('hideModal')
        }
    }
}
</script>
