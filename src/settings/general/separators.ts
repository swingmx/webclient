import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'

import useSettingsStore from '@/stores/settings'
import { updateConfig } from '@/requests/settings'
import { getT } from '@/i18n'

const { t } = getT()

export default <Setting>{
    title: t("Settings.General.Separators.Title"),
    desc: t("Settings.General.Separators.Description"),
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

        const { status } = await updateConfig("artistSeparators", payload)

        if (status == 200) {
            useSettingsStore().setArtistSeparators(payload.split(','))
        }

        return true
    },
    type: SettingType.separators_input,
}
