import modal from '@/stores/modal'
import useArtist from '@/stores/pages/artist'

import { SearchIcon } from '@/icons'
import { Album, Collection, Option, Playlist } from '@/interfaces'
import { getAllCollections } from '@/requests/collections'
import { getAllPlaylists } from '@/requests/playlists'

export const separator: Option = {
    type: 'separator',
}

export function get_new_playlist_option(new_playlist_modal_props: any = {}): Option {
    return {
        label: 'New playlist',
        action: () => {
            modal().showNewPlaylistModal(new_playlist_modal_props)
        },
    }
}

export function get_new_collection_option(new_collection_modal_props: any = {}): Option {
    return {
        label: 'New Collection',
        action: () => {
            modal().showCollectionModal(new_collection_modal_props)
        },
    }
}

type action = (playlist: Playlist) => void

/**
 *
 * @param addToPlaylist Function to be called when a playlist is selected
 * @param new_playlist_modal_props Props to be passed to the modal when creating a new playlist
 * @returns A list of options to be used in a context menu
 */
export async function getAddToPlaylistOptions(addToPlaylist: action, new_playlist_modal_props: any = {}) {
    const new_playlist = get_new_playlist_option(new_playlist_modal_props)
    const p = await getAllPlaylists(true)

    let items = [new_playlist]

    if (p.length === 0) {
        return items
    }

    let playlists = <Option[]>[]

    playlists = p.map(playlist => {
        return <Option>{
            label: playlist.name,
            action: () => {
                addToPlaylist(playlist)
            },
        }
    })

    return [...items, separator, ...playlists]
}

/**
 *
 * @param addToPlaylist Function to be called when a playlist is selected
 * @param new_playlist_modal_props Props to be passed to the modal when creating a new playlist
 * @returns A list of options to be used in a context menu
 */
export async function getAddToCollectionOptions(
    addToCollection: (collection: Collection) => void,
    new_page_modal_props: any = {}
) {
    const new_page = get_new_collection_option(new_page_modal_props)
    const data = await getAllCollections()

    let items = [new_page]

    if (data.length === 0) {
        return items
    }

    let collections = <Option[]>[]

    collections = data.map(collection => {
        return <Option>{
            label: collection.name,
            action: () => {
                addToCollection(collection)
            },
        }
    })

    return [...items, separator, ...collections]
}

export const get_find_on_social = (page = 'album', query = '', album?: Album) => {
    const is_album = page === 'album'
    const getAlbumSearchTerm = () => {
        return `${album?.title} - ${album?.albumartists.map(a => a.name).join(', ')}`
    }
    const search_term = query ? query : is_album ? getAlbumSearchTerm() : useArtist().info.name

    return <Option>{
        label: 'Search on',
        icon: SearchIcon,
        children: async () => [
            {
                label: 'Google',
                action: () => window.open(`https://www.google.com/search?q=${search_term}`, '_blank'),
            },
            {
                label: 'YouTube',
                action: () => window.open(`https://www.youtube.com/results?search_query=${search_term}`, '_blank'),
            },
            {
                label: 'Spotify',
                action: () => window.open(`https://open.spotify.com/search/${search_term}/${page}s`, '_blank'),
            },
            {
                label: 'Tidal',
                action: () => window.open(`https://listen.tidal.com/search/${page}s?q=${search_term}`, '_blank'),
            },
            {
                label: 'Apple Music',
                action: () => window.open(`https://music.apple.com/search?term=${search_term}`, '_blank'),
            },
            {
                label: 'Deezer',
                action: () => window.open(`https://www.deezer.com/search/${search_term}/${page}`, '_blank'),
            },
            {
                label: 'Wikipedia',
                action: () =>
                    window.open(`https://en.wikipedia.org/wiki/Special:Search?search=${search_term}`, '_blank'),
            },
            {
                label: 'Last.fm',
                action: () => window.open(`https://www.last.fm/search/${page}s?q=${search_term}`, '_blank'),
            },
        ],
    }
}
