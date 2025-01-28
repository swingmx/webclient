<template>
    <form action="" v-if="delete">
        <div>Are you sure you want to delete this page?</div>
        <br />
        <button @click.prevent="submit" class="critical">Yes, Delete</button>
    </form>
    <form class="playlist-modal" @submit.prevent="submit" v-else>
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
import { createNewPage, deletePage, updatePage } from '@/requests/pages'
import { router } from '@/router';
import { NotifType, Notification } from '@/stores/notification'

const props = defineProps<{
    page?: Page
    hash?: string
    type?: string
    extra?: any
    delete?: boolean
}>()

const emit = defineEmits<{
    (e: 'hideModal'): void
    (e: 'setTitle', title: string): void
}>()

emit('setTitle', props.page ? (props.delete ? 'Delete Page' : 'Update Page') : 'New Page')

async function submit(e: Event) {
    if (props.delete && props.page) {
        const deleted = await deletePage(props.page.id)
        if (deleted) {
            new Notification('Page deleted', NotifType.Success)
            emit('hideModal')
            router.push('/')
        }
        return
    }

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
}
</script>
