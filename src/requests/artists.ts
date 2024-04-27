import { paths } from '@/config'
import { Album, Artist, Track } from '@/interfaces'
import { NotifType, useToast } from '@/stores/notification'
import useAxios from './useAxios'

export const getArtistData = async (hash: string, limit: number = 5) => {
    interface ArtistData {
        artist: Artist
        tracks: Track[]
        genres: string[]
    }

    const { data, error, status } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}?limit=${limit}`,
    })

    if (status == 404) {
        useToast().showNotification('Artist not found', NotifType.Error)
    }

    if (error) {
        console.error(error)
    }

    return data as ArtistData
}

export const getArtistAlbums = async (hash: string, limit = 6, all = false) => {
    interface ArtistAlbums {
        artistname: string
        albums: Album[]
        singles_and_eps: Album[]
        appearances: Album[]
        compilations: Album[]
    }

    const { data, error } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}/albums?limit=${limit}&all=${all}`,
    })

    if (error) {
        console.error(error)
    }

    return data as ArtistAlbums
}

export const getArtistTracks = async (hash: string) => {
    const { data, error } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}/tracks`,
    })

    if (error) {
        console.error(error)
    }

    return data as Track[]
}

export const getSimilarArtists = async (hash: string, limit = 6) => {
    const { data, error } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}/similar?limit=${limit}`,
    })

    if (error) {
        console.error(error)
    }

    return data as Artist[]
}

export async function saveArtistAsPlaylist(name: string, hash: string) {
    const { data, error } = await useAxios({
        url: paths.api.artist + `/${hash}/playlist`,
        props: {
            name,
        },
    })

    if (error) {
        console.error(error)
    }

    return data
}
