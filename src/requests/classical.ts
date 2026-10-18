import { paths } from '@/config'
import { ClassicalWorkPage } from '@/interfaces'
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
