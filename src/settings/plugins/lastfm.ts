import useSettings from '@/stores/settings'
import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'

const authorize = <Setting>{
    title: 'Connect your account',
    desc: 'Allow Swing Music to access your Last.fm account',
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
            return 'Finish'
        }

        if (settings.lastfm_session_key) {
            return 'Disconnect'
        }

        return 'Connect'
    },
}

// const api_key = <Setting>{
//     title: 'Use custom API Key',
//     desc: 'instead of the Swing Music default to authenticate with Last.fm',
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
//     title: 'Use custom API Secret',
//     desc: 'instead of the Swing Music default to sign your scrobble submission',
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
