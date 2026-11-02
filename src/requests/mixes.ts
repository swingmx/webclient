import { paths } from '@/config'
import useAxios from './useAxios'
import { Mix } from '@/interfaces'

export async function getSavedMixes() {
    const res = await useAxios({
        url: paths.api.mixes + '/saved',
        method: 'GET',
    })

    return res.status === 200 ? (res.data as Mix[]) : []
}

export async function getMixes(type: string, start: number, limit: number) {
    const res = await useAxios({
        url: paths.api.mixes + `/${type}?start=${start}&limit=${limit}`,
        method: 'GET',
    })

    if (res.status !== 200) return { saved: [], mixes: [], total: 0 }
    return res.data as { saved: Mix[]; mixes: Mix[]; total: number }
}

export function getMix(mixid: string, sourcehash: string, og_sourcehash?: string) {
    return useAxios({
        url: paths.api.mixes + `/?mixid=${mixid}&sourcehash=${sourcehash}&og_sourcehash=${og_sourcehash}`,
        method: 'GET',
    })
}
