import { paths } from '@/config'
import { Album, Artist, ClassicalPersonPage, ClassicalPersonWorks, ClassicalWork, Genre, Listening, StatItem, Track } from '@/interfaces'
import { NotifType, useToast } from '@/stores/notification'
import useAxios from './useAxios'
import { useT } from '@/i18n'

const { t } = useT();

export interface ArtistData {
    type: 'artist'
    artist: Artist
    tracks: Track[]
    albums: {
        albums: Album[]
        singles_and_eps: Album[]
        appearances: Album[]
        compilations: Album[]
    }
    genres: Genre[]
    listening: Listening | null
    stats: StatItem[]
}

/**
 * An artist page, or a composer or performer page, told apart by `type`.
 * `query` carries the work filter (`category` or `composer`).
 */
export const getArtistData = async (
    hash: string,
    limit: number = 15,
    albumlimit: number = 7,
    query: Record<string, string> = {}
) => {
    const params = new URLSearchParams({ tracklimit: String(limit), albumlimit: String(albumlimit), ...query })
    const { data, error, status } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}?${params.toString()}`,
    })

    if (status == 404) {
        useToast().showNotification(t('Requests.Artists.ArtistNotFound'), NotifType.Error)
    }

    if (error) {
        console.error(error)
    }

    return data as ArtistData | ClassicalPersonPage
}

export const getArtistWorks = async (hash: string, query: Record<string, string> = {}) => {
    const params = new URLSearchParams(query).toString()
    const { data, status } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}/works${params ? `?${params}` : ''}`,
    })
    return status === 200 ? (data as ClassicalPersonWorks) : null
}

export const getArtistAlbums = async (hash: string, limit = 6, all = false) => {
    interface ArtistAlbums {
        artistname: string
        albums: Album[]
        singles_and_eps: Album[]
        appearances: Album[]
        compilations: Album[]
        classical?: Album[]
        live?: Album[]
        soundtracks?: Album[]
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

/**
 * An artist's tracks for queueing. A composer or performer answers with
 * their repertoire as works, most listened first: their movements in order,
 * and the works to label them with.
 */
export const getArtistTracks = async (hash: string): Promise<{ tracks: Track[]; works?: ClassicalWork[] }> => {
    const { data, error } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}/tracks`,
    })

    if (error) {
        console.error(error)
    }

    if (data && !Array.isArray(data) && Array.isArray(data.works)) {
        const works = data.works as ClassicalWork[]
        return { tracks: works.flatMap(work => work.movements), works }
    }

    return { tracks: (data as Track[]) ?? [] }
}

export const getSimilarArtists = async (hash: string, limit = 6) => {
    const { data, error } = await useAxios({
        method: 'GET',
        url: paths.api.artist + `/${hash}/similar?artistlimit=${limit}`,
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
