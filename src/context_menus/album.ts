import useAlbum from '@/stores/pages/album'
import useTracklist from '@/stores/queue/tracklist'

import { AddToQueueIcon, DeleteIcon, PlayNextIcon, PlusIcon } from '@/icons'
import { Album, Option, Page, Playlist, Track } from '@/interfaces'
import { getAlbumTracks } from '@/requests/album'
import { addOrRemoveItemFromPage } from '@/requests/pages'
import { addAlbumToPlaylist } from '@/requests/playlists'
import { getAddToPageOptions, getAddToPlaylistOptions, get_find_on_social } from './utils'
import { router, Routes } from '@/router'

export default async (album?: Album) => {
    const albumStore = useAlbum()

    if (!album) {
        album = albumStore.info
    }

    const play_next = <Option>{
        label: 'Play next',
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
        label: 'Add to queue',
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
        label: 'Add to Playlist',
        children: () =>
            getAddToPlaylistOptions(AddToPlaylistAction, {
                albumhash: album.albumhash,
                playlist_name: album.title,
            }),
        icon: PlusIcon,
    }

    const addToPageAction = (page: Page) => {
        addOrRemoveItemFromPage(page.id, album, 'album', 'add')
    }

    const add_to_page: Option = {
        label: 'Add to Page',
        children: () =>
            getAddToPageOptions(addToPageAction, {
                page: null,
                hash: album.albumhash,
                type: 'album',
                extra: {},
            }),
        icon: PlusIcon,
    }

    const remove_from_page: Option = {
        label: 'Remove from Page',
        action: async () => {
            await addOrRemoveItemFromPage(
                parseInt(router.currentRoute.value.params.page as string),
                album,
                'album',
                'remove'
            )
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
