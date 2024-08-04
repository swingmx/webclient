import { paths } from '@/config'
import { DBSettings } from '@/enums'
import useAxios from '../useAxios'

export async function getAllSettings() {
    const { data, status } = await useAxios({
        url: paths.api.settings.base,
        method: 'GET',
    })

    const settings = data as DBSettings

    return { settings, status }
}

export async function updateConfig(key: string, value: any) {
    return await useAxios({
        url: paths.api.settings.updateConfig,
        method: 'PUT',
        props: {
            key,
            value,
        },
    })
}
