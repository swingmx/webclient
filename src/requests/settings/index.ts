import { paths } from '@/config'
import { DBSettings, DbSettingKeys } from '@/enums'
import useAxios from '../useAxios'

export async function setSetting(key: DbSettingKeys, value: any) {
    const { data, status } = await useAxios({
        url: paths.api.settings.base + '/set',
        props: { key, value },
    })

    const result = data.result

    return { result, status }
}

export async function getAllSettings() {
    const { data, status } = await useAxios({
        url: paths.api.settings.base,
        method: 'GET',
    })

    const settings = data.settings as DBSettings

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
