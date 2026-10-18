import { paths } from '@/config'
import {
    ClassicalWork,
    ClassicalWorkPage,
    ComposerAlbumsPage,
    ComposerPage,
    ComposerWorksPage,
} from '@/interfaces'
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

function categoryQuery(category?: string) {
    return category ? `?category=${encodeURIComponent(category)}` : ''
}

async function get<T>(url: string) {
    const { data, status } = await useAxios({ url, method: 'GET' })
    if (status !== 200) return null
    return data as T
}

export function getComposer(composerhash: string, category?: string) {
    return get<ComposerPage>(`${paths.api.classicalComposers}/${composerhash}${categoryQuery(category)}`)
}

export function getComposerWorks(composerhash: string, category?: string) {
    return get<ComposerWorksPage>(`${paths.api.classicalComposers}/${composerhash}/works${categoryQuery(category)}`)
}

export function getComposerAlbums(composerhash: string) {
    return get<ComposerAlbumsPage>(`${paths.api.classicalComposers}/${composerhash}/albums`)
}

export function getComposerTracks(composerhash: string) {
    return get<{ composerhash: string; works: (ClassicalWork & { albumhash: string })[] }>(
        `${paths.api.classicalComposers}/${composerhash}/tracks`
    )
}
