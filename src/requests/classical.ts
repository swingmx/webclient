import { paths } from '@/config'
import { Album, Artist, ClassicalHomePage, ClassicalWorkPage, WorkCardItem } from '@/interfaces'
import useAxios from './useAxios'

export async function getWork(token: string, albumhash?: string) {
    const query = albumhash ? `?albumhash=${encodeURIComponent(albumhash)}` : ''

    const { data, status } = await useAxios({
        url: `${paths.api.classicalWork}/${token}${query}`,
        method: 'GET',
    })

    if (status !== 200) return null

    return data as ClassicalWorkPage
}

async function getClassical<T>(path: string) {
    const { data, status } = await useAxios({ url: `/classical${path}`, method: 'GET' })
    return status === 200 ? (data as T) : null
}

export function getClassicalHome(cardLimit: number) {
    return getClassical<ClassicalHomePage>(`/home?card_limit=${cardLimit}`)
}

/**
 * Works by era, instrument, or work type, or sorted by date added,
 * favorites, or plays; `query` holds one of those keys.
 */
export function getClassicalWorks(query: Record<string, string>) {
    const params = new URLSearchParams(query).toString()
    return getClassical<{ title: string | null; works: WorkCardItem[] }>(`/works${params ? `?${params}` : ''}`)
}

export function getClassicalAlbums() {
    return getClassical<Album[]>('/albums')
}

export function getClassicalComposers() {
    return getClassical<Artist[]>('/composers')
}
