import { paths } from '@/config'
import { Album, Track } from '@/interfaces'
import { NotifType, useToast } from '@/stores/notification'
import useAxios from './useAxios'

const {
    album: albumUrl,
    albumartists: albumArtistsUrl,
    albumbio: albumBioUrl,
    albumsByArtistUrl,
    albumVersions,
} = paths.api

const getAlbumData = async (albumhash: string, ToastStore: typeof useToast) => {
    interface AlbumData {
        info: Album
        tracks: Track[]
    }

    const { data, status } = await useAxios({
        url: albumUrl,
        props: {
            albumhash,
        },
    })

    if (status == 204) {
        ToastStore().showNotification('Album not created yet!', NotifType.Error)
    }

    return data as AlbumData
}

const getAlbumArtists = async (hash: string) => {
    const { data, error } = await useAxios({
        url: albumArtistsUrl,
        props: {
            hash: hash,
        },
    })

    if (error) {
        console.error(error)
    }

    return data.artists
}

const getAlbumBio = async (hash: string) => {
    const { data, status } = await useAxios({
        url: albumBioUrl,
        props: {
            hash: hash,
        },
    })

    if (data) {
        return data.bio
    }

    if (status == 404) {
        return null
    }
}

export const getAlbumsFromArtist = async (
    albumartists: string,
    limit: number = 2,
    base_title: string
) => {
    const { data } = await useAxios({
        url: albumsByArtistUrl,
        props: {
            albumartists: albumartists,
            limit: limit,
            base_title,
        },
    })

    if (data) {
        return data
    }

    return []
}

export const getAlbumVersions = async (
    og_album_title: string,
    base_title: string,
    artisthash: string
) => {
    const { data } = await useAxios({
        url: albumVersions,
        props: {
            og_album_title,
            base_title,
            artisthash,
        },
    })

    if (data) {
        return data
    }

    return []
}

export async function getAlbumTracks(albumhash: string): Promise<Track[]> {
    const { data } = await useAxios({
        url: albumUrl + `/${albumhash}/` + 'tracks',
        method: 'GET',
    })

    return data
}

export async function getSimilarAlbums(
    artisthash: string,
    limit: number = 5
): Promise<Album[]> {
    const { data } = await useAxios({
        url:
            albumUrl +
            '/similar?' +
            'artisthash=' +
            artisthash +
            '&limit=' +
            limit,
        method: 'GET',
    })

    return data
}

export { getAlbumData as getAlbum, getAlbumArtists, getAlbumBio }
