import useSettings from '@/stores/settings'
import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'
import { getT } from '@/i18n'

const { t } = getT()

const authorize = <Setting>{
    title: t("Settings.Plugins.LastFM.Authorize.Title"),
    desc: t("Settings.Plugins.LastFM.Authorize.Description"),
    type: SettingType.button,
    action: () => {
        const settings = useSettings()
        if (settings.lastfm_integration_started) {
            return settings.finishLastfmAuth()
        }

        if (settings.lastfm_session_key) {
            return settings.disconnectLastfm()
        }

        return settings.authorizeLastfmApiKey()
    },
    button_text: () => {
        const settings = useSettings()
        if (settings.lastfm_integration_started) {
            return t("Common.Finish")
        }

        if (settings.lastfm_session_key) {
            return t("Common.Disconnect")
        }

        return t("Common.Connect")
    },
}

// const api_key = <Setting>{
//     title: t("Settings.Plugins.LastFM.ApiKey.Title"),
//     desc: t("Settings.Plugins.LastFM.ApiKey.Description"),
//     type: SettingType.secretinput,
//     state: () => useSettings().lastfm_api_key,
//     action: (value: string) => {
//         if (!value) {
//             return
//         }
//         return useSettings().setLastfmApiKey(value)
//     },
// }

// const api_secret = <Setting>{
//     title: t("Settings.Plugins.LastFM.ApiSecret.Title"),
//     desc: t("Settings.Plugins.LastFM.ApiSecret.Description")'',
//     type: SettingType.secretinput,
//     state: () => useSettings().lastfm_api_secret,
//     action: (value: string) => {
//         if (!value) {
//             return
//         }
//         return useSettings().setLastfmApiSecret(value)
//     },
// }

export default [authorize]
