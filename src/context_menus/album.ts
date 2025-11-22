import { router, Routes } from '@/router'

import useAlbum from '@/stores/pages/album'
import useCollection from '@/stores/pages/collections'
import useTracklist from '@/stores/queue/tracklist'

import { getAlbumTracks } from '@/requests/album'
import { addOrRemoveItemFromCollection } from '@/requests/collections'
import { addAlbumToPlaylist } from '@/requests/playlists'

import { AddToQueueIcon, DeleteIcon, PlayNextIcon, PlusIcon } from '@/icons'
import { Album, Collection, Option, Playlist, Track } from '@/interfaces'
import { get_find_on_social, getAddToCollectionOptions, getAddToPlaylistOptions } from './utils'
import { getT } from '@/i18n'

const { t } = getT();

export default async (album?: Album) => {
    const albumStore = useAlbum()

    if (!album) {
        album = albumStore.info
    }

    const play_next = <Option>{
        label: t('Menus.Common.PlayNext'),
        action: async () => {
            let tracks: Track[] = []

            if (album) {
                tracks = await getAlbumTracks(album.albumhash)
            } else {
                tracks = albumStore.tracks.filter(track => !track.is_album_disc_number)
            }

            useTracklist().insertAfterCurrent(tracks)
        },
        icon: PlayNextIcon,
    }

    const add_to_queue = <Option>{
        label: t('Menus.Common.AddToQueue'),
        action: async () => {
            let tracks: Track[] = []

            if (album) {
                tracks = await getAlbumTracks(album.albumhash)
            } else {
                tracks = albumStore.tracks.filter(track => !track.is_album_disc_number)
            }

            useTracklist().addTracks(tracks)
        },
        icon: AddToQueueIcon,
    }

    // Action for each playlist option
    const AddToPlaylistAction = (playlist: Playlist) => {
        addAlbumToPlaylist(playlist, album.albumhash)
    }

    const add_to_playlist: Option = {
        label: t('Menus.Common.AddToPlaylist'),
        children: () =>
            getAddToPlaylistOptions(AddToPlaylistAction, {
                albumhash: album.albumhash,
                playlist_name: album.title,
            }),
        icon: PlusIcon,
    }

    const addToPageAction = (page: Collection) => {
        addOrRemoveItemFromCollection(page.id, album, 'album', 'add')
    }

    const add_to_page: Option = {
        label: t('Menus.Common.AddToCollection'),
        children: () =>
            getAddToCollectionOptions(addToPageAction, {
                collection: null,
                hash: album.albumhash,
                type: 'album',
                extra: {},
            }),
        icon: PlusIcon,
    }

    const remove_from_page: Option = {
        label: t('Menus.Common.RemoveFromCollection'),
        action: async () => {
            const success = await addOrRemoveItemFromCollection(
                parseInt(router.currentRoute.value.params.collection as string),
                album,
                'album',
                'remove'
            )

            if (success) {
                useCollection().removeLocalItem(album, 'album')
            }
        },
        icon: DeleteIcon,
    }

    return [
        play_next,
        add_to_queue,
        add_to_playlist,
        ...[router.currentRoute.value.name === Routes.Page ? remove_from_page : add_to_page],
        get_find_on_social('album', '', album),
    ]
}
