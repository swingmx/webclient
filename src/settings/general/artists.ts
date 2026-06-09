import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'

import useSettingsStore from '@/stores/settings'
import { updateConfig } from '@/requests/settings'

const separators = <Setting>{
    title: 'Enter separators separated by a comma',
    desc: `These will be used to separate artists and album artists`,
    state: () => {
        const store = useSettingsStore()

        const root_dirs_set = store.root_dirs.length > 0

        if (root_dirs_set) {
            return store.separators
        }

        return []
    },
    action: async (payload: string) => {
        if (!payload) return

        const { status } = await updateConfig('artistSeparators', payload)

        if (status == 200) {
            useSettingsStore().setArtistSeparators(payload.split(','))
        }

        return true
    },
    type: SettingType.separators_input,
}

const articleAwareSorting = <Setting>{
    title: 'Article aware sorting',
    desc: "Ignore articles (e.g. The, A, An) when sorting artist names",
    type: SettingType.binary,
    state: () => useSettingsStore().article_aware_sorting,
    action: () => useSettingsStore().toggleArticleAwareSorting(),
}

export default [articleAwareSorting, separators]
