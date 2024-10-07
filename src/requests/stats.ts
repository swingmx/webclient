import { paths } from '@/config'
import useAxios from './useAxios'

export async function getChartItem(item: string, duration: number, limit: number, order_by: string) {
    const res = await useAxios({
        url: paths.api.stats.base + `/top-${item}?duration=${duration}&limit=${limit}&order_by=${order_by}`,
        method: 'GET',
    })

    return res
}

export async function getTopArtists(duration: number, limit: number, order_by: string) {
    return await getChartItem('artists', duration, limit, order_by)
}

export async function getTopAlbums(duration: number, limit: number, order_by: string) {
    return await getChartItem('albums', duration, limit, order_by)
}

export async function getTopTracks(duration: number, limit: number, order_by: string) {
    return await getChartItem('tracks', duration, limit, order_by)
}

export async function getStats() {
    const res = await useAxios({
        url: paths.api.stats.base + "/stats",
        method: 'GET',
    })

    return res
}