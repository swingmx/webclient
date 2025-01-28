<template>
    <form class="playlist-modal" @submit.prevent="submit">
        <label for="name">Page name</label>
        <br />
        <input type="search" class="rounded-sm" id="name" :value="page?.name" />
        <br />
        <label for="description">Description</label>
        <br />
        <input type="search" class="rounded-sm" id="description" :value="page?.extra.description" />
        <br /><br />
        <button type="submit">{{ page ? 'Update' : 'Create' }}</button>
    </form>
</template>

<script setup lang="ts">
import { Page } from '@/interfaces'
import { createNewPage, updatePage } from '@/requests/pages'
import { NotifType, Notification } from '@/stores/notification'

const props = defineProps<{
    page?: Page
    hash?: string
    type?: string
    extra?: any
}>()

const emit = defineEmits<{
    (e: 'hideModal'): void
    (e: 'setTitle', title: string): void
}>()

emit('setTitle', props.page ? 'Update Page' : 'New Page')

async function submit(e: Event) {
    e.preventDefault()
    const name = (e.target as any).elements['name'].value
    const description = (e.target as any).elements['description'].value

    // If the page is null, we are creating a new page
    if (props.page == null) {
        const created = await createNewPage(name, description, [
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
        const updatedPage = await updatePage(props.page, name, description)

        if (updatedPage) {
            props.page.name = updatedPage.name
            props.page.extra.description = updatedPage.extra.description
            new Notification('Page updated', NotifType.Success)
            emit('hideModal')
        }
    }

    // If the page is not null, we are updating the page
}
</script>
