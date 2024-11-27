import { paths } from '@/config'
import useAxios from './useAxios'

export function getMix(mixid: string) {
    return useAxios({
        url: paths.api.mixes + `/?mixid=${mixid}`,
        method: 'GET',
    })
}
