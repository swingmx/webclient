import { Routes, router } from '@/router'

import useCollection from '@/stores/pages/collections'
import useTracklist from '@/stores/queue/tracklist'

import { getArtistTracks } from '@/requests/artists'
import { addOrRemoveItemFromCollection } from '@/requests/collections'
import { addArtistToPlaylist } from '@/requests/playlists'

import { AddToQueueIcon, DeleteIcon, PlayNextIcon, PlusIcon } from '@/icons'
import { Artist, Collection, Option, Playlist } from '@/interfaces'
import { getAddToCollectionOptions, getAddToPlaylistOptions, get_find_on_social } from './utils'

export default async (artisthash: string, artistname: string) => {
    const play_next = <Option>{
        label: 'Play next',
        action: () => {
            getArtistTracks(artisthash).then(tracks => {
                const store = useTracklist()
                store.insertAfterCurrent(tracks)
            })
        },
        icon: PlayNextIcon,
    }

    const add_to_queue = <Option>{
        label: 'Add to queue',
        action: () => {
            getArtistTracks(artisthash).then(tracks => {
                const store = useTracklist()
                store.addTracks(tracks)
            })
        },
        icon: AddToQueueIcon,
    }

    // Action for each playlist option
    const AddToPlaylistAction = (playlist: Playlist) => {
        addArtistToPlaylist(playlist, artisthash)
    }

    const add_to_playlist: Option = {
        label: 'Add to Playlist',
        children: () =>
            getAddToPlaylistOptions(AddToPlaylistAction, {
                artisthash,
                playlist_name: `This is ${artistname}`,
            }),
        icon: PlusIcon,
    }

    const addToCollectionAction = (collection: Collection) => {
        addOrRemoveItemFromCollection(
            collection.id,
            {
                artisthash,
            } as Artist,
            'artist',
            'add'
        )
    }

    const add_to_page: Option = {
        label: 'Add to Collection',
        children: () =>
            getAddToCollectionOptions(addToCollectionAction, {
                collection: null,
                hash: artisthash,
                type: 'artist',
                extra: {},
            }),
        icon: PlusIcon,
    }

    const remove_from_collection: Option = {
        label: 'Remove item',
        action: async () => {
            const success = await addOrRemoveItemFromCollection(
                parseInt(router.currentRoute.value.params.collection as string),
                {
                    artisthash,
                } as Artist,
                'artist',
                'remove'
            )

            if (success) {
                useCollection().removeLocalItem({ artisthash } as Artist, 'artist')
            }
        },
        icon: DeleteIcon,
    }

    return [
        play_next,
        add_to_queue,
        add_to_playlist,
        ...[router.currentRoute.value.name === Routes.Page ? remove_from_collection : add_to_page],
        get_find_on_social('artist'),
    ]
}
