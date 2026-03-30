import { Option, Playlist, Collection } from '@/interfaces'
import { addOrRemoveItemFromCollection } from '@/requests/collections'
import { Routes, router } from '@/router'
import useCollection from '@/stores/pages/collections'
import { DeleteIcon, PlusIcon } from '@/icons'
import { getAddToCollectionOptions } from './utils'

export default async (playlist: Playlist): Promise<Option[]> => {
    const addToCollectionAction = (collection: Collection) => {
        addOrRemoveItemFromCollection(collection.id, playlist, 'playlist', 'add')
    }

    const add_to_collection: Option = {
        label: 'Add to Collection',
        children: () =>
            getAddToCollectionOptions(addToCollectionAction, {
                collection: null,
                hash: playlist.id.toString(),
                type: 'playlist',
                extra: {},
            }),
        icon: PlusIcon,
    }

    const remove_from_collection: Option = {
        label: 'Remove item',
        action: async () => {
            const success = await addOrRemoveItemFromCollection(
                parseInt(router.currentRoute.value.params.collection as string),
                playlist,
                'playlist',
                'remove'
            )

            if (success) {
                useCollection().removeLocalItem(playlist as any, 'playlist' as any)
            }
        },
        icon: DeleteIcon,
        critical: true,
    }

    return [...[router.currentRoute.value.name === Routes.Page ? remove_from_collection : add_to_collection]]
}
