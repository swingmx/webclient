import { paths } from '@/config'
import { favType, NotifType } from '@/enums'
import useAxios from './useAxios'

import { Album, Artist, Track } from '@/interfaces'
import { useToast as notif } from '@/stores/notification'

export async function addFavorite(favtype: favType, itemhash: string) {
    const { error } = await useAxios({
        url: paths.api.addFavorite,
        props: {
            type: favtype,
            hash: itemhash,
        },
    })

    if (error) {
        notif().showNotification('An error occured!', NotifType.Error)
        return false
    }

    return true
}

export async function removeFavorite(favtype: favType, itemhash: string) {
    const { error } = await useAxios({
        url: paths.api.removeFavorite,
        props: {
            type: favtype,
            hash: itemhash,
        },
    })

    if (error) {
        notif().showNotification('An error occured!', NotifType.Error)
        return false
    }

    return true
}

export async function getAllFavs(
    track_limit = 6,
    album_limit = 6,
    artist_limit = 6
) {
    const { data } = await useAxios({
        url:
            paths.api.favorites +
            `?track_limit=${track_limit}&album_limit=${album_limit}&artist_limit=${artist_limit}`,
        method: 'GET',
    })

    return data
}

export async function getFavAlbums(limit = 6) {
    const { data } = await useAxios({
        url: paths.api.favAlbums + `?limit=${limit}`,
        method: 'GET',
    })

    return data.albums as Album[]
}

export async function getFavTracks(limit = 5) {
    const { data } = await useAxios({
        url: paths.api.favTracks + `?limit=${limit}`,
        method: 'GET',
    })

    return data.tracks as Track[]
}

export async function getFavArtists(limit = 6) {
    const { data } = await useAxios({
        url: paths.api.favArtists + `?limit=${limit}`,
        method: 'GET',
    })

    return data.artists as Artist[]
}

export async function isFavorite(itemhash: string, type: favType) {
    const { data } = await useAxios({
        url: paths.api.isFavorite + `?hash=${itemhash}&type=${type}`,
        method: 'GET',
    })

    try {
        return data.is_favorite as boolean
    } catch (error) {
        return false
    }
}
