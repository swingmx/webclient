import { Routes, router } from '@/router'

import useAuth from '@/stores/auth'
import { collectives } from '@/stores/commandPalette'
import { NotifType, useToast } from '@/stores/notification'
import useArtist from '@/stores/pages/artist'
import useModal from '@/stores/modal'
import useCollection from '@/stores/pages/collections'
import useTracklist from '@/stores/queue/tracklist'

import { getArtistTracks } from '@/requests/artists'
import { addOrRemoveItemFromCollection } from '@/requests/collections'
import { addArtistToPlaylist } from '@/requests/playlists'

import { AddToQueueIcon, DeleteIcon, MergeIcon, PlayNextIcon, PlusIcon } from '@/icons'
import { Artist, Collection, Option, Playlist } from '@/interfaces'
import { getAddToCollectionOptions, getAddToPlaylistOptions, get_find_on_social, separator } from './utils'
import { useT } from '@/i18n'

const { t } = useT()

export default async (artisthash: string, artistname: string) => {
    const play_next = <Option>{
        label: t('Menus.Common.PlayNext'),
        action: () => {
            getArtistTracks(artisthash).then(({ tracks, works }) => {
                const store = useTracklist()
                store.insertAfterCurrent(tracks, works)
            })
        },
        icon: PlayNextIcon,
    }

    const add_to_queue = <Option>{
        label: t('Menus.Common.AddToQueue'),
        action: () => {
            getArtistTracks(artisthash).then(({ tracks, works }) => {
                const store = useTracklist()
                store.addTracks(tracks, works)
            })
        },
        icon: AddToQueueIcon,
    }

    // Action for each playlist option
    const AddToPlaylistAction = (playlist: Playlist) => {
        addArtistToPlaylist(playlist, artisthash)
    }

    const add_to_playlist: Option = {
        label: t('Menus.Common.AddToPlaylist'),
        children: () =>
            getAddToPlaylistOptions(AddToPlaylistAction, {
                artisthash,
                playlist_name: t('Menus.Artist.ThisIsPlaylist', { artist: artistname }),
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
        label: t('Menus.Common.AddToCollection'),
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
        label: t('Menus.Common.RemoveFromCollection'),
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

    const merge_into: Option = {
        label: t('Menus.Artist.MergeInto'),
        action: () => useModal().showMergeArtistModal(artisthash, artistname),
        icon: MergeIcon,
    }

    const add_to_collective: Option = {
        label: t('Menus.Artist.AddToCollective'),
        children: async () => [
            {
                label: t('Menus.Artist.NewCollective'),
                action: () => useModal().showNewCollectiveModal({ hash: artisthash, name: artistname }),
            },
            ...(collectives().length ? [separator] : []),
            ...collectives().map(collective => ({
                label: collective.name,
                action: async () => {
                    const members = [...new Set([...(collective.members ?? []), artisthash])]
                    const saved = await useArtist().saveCollective(collective.hash, { members })

                    if (saved) {
                        useToast().showNotification(
                            t('ArtistView.AddedToCollective', { name: collective.name }),
                            NotifType.Success
                        )
                    }
                },
            })),
        ],
        icon: PlusIcon,
    }

    const is_collective = collectives().some(c => c.hash === artisthash)
    const admin_options = is_collective ? [] : [add_to_collective, merge_into]

    return [
        play_next,
        add_to_queue,
        add_to_playlist,
        ...[router.currentRoute.value.name === Routes.Page ? remove_from_collection : add_to_page],
        ...(useAuth().is_admin ? admin_options : []),
        get_find_on_social('artist'),
    ]
}
