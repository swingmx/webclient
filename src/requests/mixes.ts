import { paths } from '@/config'
import useAxios from './useAxios'

export function getMix(mixid: string, sourcehash: string, og_sourcehash?: string) {
    return useAxios({
        url: paths.api.mixes + `/?mixid=${mixid}&sourcehash=${sourcehash}&og_sourcehash=${og_sourcehash}`,
        method: 'GET',
    })
}
