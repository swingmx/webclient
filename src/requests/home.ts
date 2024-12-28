import { paths } from '@/config'
import useAxios from './useAxios'

export async function getRecents(path: string, limit: number) {
    const { data } = await useAxios({
        url: path + '?limit=' + limit,
        method: 'GET',
    })

    return data
}

export async function getRecentlyAdded(limit: number) {
    return getRecents(paths.api.home.recentlyAdded, limit)
}

export async function getRecentlyPlayed(limit: number) {
    return getRecents(paths.api.home.recentlyPlayed, limit)
}

export async function getHomePageData(limit: number) {
    const { data } = await useAxios({
        url: paths.api.home.base + '?limit=' + limit,
        method: 'GET',
    })

    return data
}
