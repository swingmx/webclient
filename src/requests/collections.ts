import { paths } from '@/config'
import { Album, Artist, Collection, Mix, Playlist } from '@/interfaces'
import { Notification, NotifType } from '@/stores/notification'
import useAxios from './useAxios'

const { base: baseCollectionUrl } = paths.api.collections

export async function getAllCollections() {
    const { data, status } = await useAxios({
        url: baseCollectionUrl,
        method: 'GET',
    })

    if (status == 200) {
        return data as Collection[]
    }

    return []
}

export async function getCollection(collection_id: string) {
    const { data, status } = await useAxios({
        url: baseCollectionUrl + `/${collection_id}`,
        method: 'GET',
    })

    return data as Collection
}

export async function createNewCollection(
    name: string,
    description: string,
    items?: { hash: string; type: string; extra: any }[]
) {
    const { data, status } = await useAxios({
        url: baseCollectionUrl,
        props: {
            name,
            description,
            items,
        },
        method: 'POST',
    })

    if (status == 201) {
        return true
    }

    return false
}

export async function updateCollection(collection: Collection, name: string, description: string) {
    const { data, status } = await useAxios({
        url: baseCollectionUrl + `/${collection.id}`,
        props: {
            name,
            description,
        },
        method: 'PUT',
    })

    if (status == 200) {
        return data as Collection
    }

    return null
}

export async function addOrRemoveItemFromCollection(
    collection_id: number,
    item: Album | Artist | Mix | Playlist,
    type: string,
    command: 'add' | 'remove'
) {
    const payload = {
        type: type,
        hash: '',
        extra: {},
    }

    switch (type) {
        case 'album':
            payload.hash = (item as Album).albumhash
            break
        case 'artist':
            payload.hash = (item as Artist).artisthash
            break
        case 'mix':
            payload.hash = (item as Mix).sourcehash
            break
        case 'playlist':
            payload.hash = (item as Playlist).id.toString()
            break
    }

    if (payload.hash === '') {
        throw new Error('Invalid item type. Item not added to collection.')
    }

    const { data, status } = await useAxios({
        url: baseCollectionUrl + `/${collection_id}/items`,
        props: {
            item: payload,
        },
        method: command == 'add' ? 'POST' : 'DELETE',
    })

    if (status == 200) {
        new Notification(
            `${payload.type[0].toUpperCase() + payload.type.slice(1)} ${
                command == 'add' ? 'added' : 'removed'
            } to page`,
            NotifType.Success
        )
        return true
    }

    if (status == 400) {
        new Notification(`${payload.type[0].toUpperCase() + payload.type.slice(1)} already in collection`, NotifType.Error)
        return false
    }

    new Notification('Failed: ' + data.error, NotifType.Error)
    return false
}

export async function deleteCollection(collection_id: number) {
    const { data, status } = await useAxios({
        url: baseCollectionUrl + `/${collection_id}`,
        method: 'DELETE',
    })

    if (status == 200) {
        return true
    }

    return false
}
