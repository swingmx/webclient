import { Routes } from '@/router'
import { router } from '@/router'

import usePage from '@/stores/pages/page'
import useTracklist from '@/stores/queue/tracklist'

import { getArtistTracks } from '@/requests/artists'
import { addArtistToPlaylist } from '@/requests/playlists'
import { addOrRemoveItemFromPage } from '@/requests/pages'

import { Artist, Option, Page, Playlist } from '@/interfaces'
import { AddToQueueIcon, DeleteIcon, PlayNextIcon, PlusIcon } from '@/icons'
import { getAddToPageOptions, getAddToPlaylistOptions, get_find_on_social } from './utils'

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

    const addToPageAction = (page: Page) => {
        addOrRemoveItemFromPage(
            page.id,
            {
                artisthash,
            } as Artist,
            'artist',
            'add'
        )
    }

    const add_to_page: Option = {
        label: 'Add to Page',
        children: () =>
            getAddToPageOptions(addToPageAction, {
                page: null,
                hash: artisthash,
                type: 'artist',
                extra: {},
            }),
        icon: PlusIcon,
    }

    const remove_from_page: Option = {
        label: 'Remove from Page',
        action: async () => {
            const success = await addOrRemoveItemFromPage(
                parseInt(router.currentRoute.value.params.page as string),
                {
                    artisthash,
                } as Artist,
                'artist',
                'remove'
            )

            if (success) {
                usePage().removeLocalItem({ artisthash } as Artist, 'artist')
            }
        },
        icon: DeleteIcon,
    }

    return [
        play_next,
        add_to_queue,
        add_to_playlist,
        ...[router.currentRoute.value.name === Routes.Page ? remove_from_page : add_to_page],
        get_find_on_social('artist'),
    ]
}
