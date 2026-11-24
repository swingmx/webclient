<template>
    <form v-if="delete" class="m-dialog" @submit.prevent="submit">
        <div class="m-body">{{ $t('CrudPage.DeleteDescription') }}</div>
        <footer class="m-footer">
            <button type="button" class="m-btn ghost" @click="emit('hideModal')">{{ $t('ConfirmModal.Cancel') }}</button>
            <button type="submit" class="m-btn destructive">{{ $t('CrudPage.DeleteButton') }}</button>
        </footer>
    </form>
    <form v-else class="m-dialog" @submit.prevent="submit">
        <div class="m-body">
            <section>
                <label class="m-label" for="name">{{ $t('CrudPage.CollectionName') }}</label>
                <input id="name" class="m-input" type="text" autocomplete="off" :value="collection?.name" />
            </section>
            <section>
                <label class="m-label" for="description">{{ $t('CrudPage.Description') }}</label>
                <input
                    id="description"
                    class="m-input"
                    type="text"
                    autocomplete="off"
                    :value="collection?.extra.description"
                />
            </section>
        </div>
        <footer class="m-footer">
            <button type="button" class="m-btn ghost" @click="emit('hideModal')">{{ $t('ConfirmModal.Cancel') }}</button>
            <button type="submit" class="m-btn primary">
                {{ collection ? $t('CrudPage.Update') : $t('CrudPage.Create') }}
            </button>
        </footer>
    </form>
</template>

<script setup lang="ts">
import { Collection } from '@/interfaces'
import { createNewCollection, deleteCollection, updateCollection } from '@/requests/collections'
import { router } from '@/router'
import { NotifType, Notification } from '@/stores/notification'
import { useT } from '@/i18n'

const { t } = useT();

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

emit('setTitle', (props.collection ? (props.delete ? t('CrudPage.DeleteTitle') : t('CrudPage.UpdateTitle')) : t('CrudPage.NewTitle')) + t('CrudPage.CollectionTitle'))

async function submit(e: Event) {
    if (props.delete && props.collection) {
        const deleted = await deleteCollection(props.collection.id)
        if (deleted) {
            new Notification(t('CrudPage.DeleteNotification'), NotifType.Success)
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
            new Notification(t('CrudPage.CreateNotification'), NotifType.Success)
            emit('hideModal')
        }
    } else {
        const updatedPage = await updateCollection(props.collection, name, description)

        if (updatedPage) {
            props.collection.name = updatedPage.name
            props.collection.extra.description = updatedPage.extra.description
            new Notification(t('CrudPage.UpdateNotification'), NotifType.Success)
            emit('hideModal')
        }
    }
}
</script>
