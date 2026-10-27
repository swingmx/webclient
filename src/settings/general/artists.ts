import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'

import useSettingsStore from '@/stores/settings'
import { updateConfig } from '@/requests/settings'
import { useT } from '@/i18n'

const { t } = useT()

const separators = <Setting>{
    title: t('Settings.General.Separators.Title'),
    desc: t('Settings.General.Separators.Description'),
    state: () => {
        const store = useSettingsStore()

        const root_dirs_set = store.root_dirs.length > 0

        if (root_dirs_set) {
            return store.separators
        }

        return []
    },
    action: async (payload: string) => {
        if (typeof payload !== 'string') return

        const { status } = await updateConfig('artistSeparators', payload)

        if (status == 200) {
            useSettingsStore().setArtistSeparators(payload ? payload.split(',') : [])
        }

        return true
    },
    type: SettingType.separators_input,
}

const jumpToArtist = <Setting>{
    title: t('Settings.General.Artists.JumpToArtistTitle'),
    desc: t('Settings.General.Artists.JumpToArtistDesc'),
    type: SettingType.binary,
    state: () => useSettingsStore().jump_to_artist,
    action: () => useSettingsStore().toggleJumpToArtist(),
}

const articleAwareSorting = <Setting>{
    title: t('Settings.General.Artists.ArticleAwareTitle'),
    desc: t('Settings.General.Artists.ArticleAwareDesc'),
    type: SettingType.binary,
    state: () => useSettingsStore().article_aware_sorting,
    action: () => useSettingsStore().toggleArticleAwareSorting(),
}

export default [jumpToArtist, articleAwareSorting, separators]
