import lyrics from './lyrics'
import useAuth from '@/stores/auth'
import { SettingCategory } from '@/interfaces/settings'

import LyricsSvg from '@/assets/icons/lyrics.svg?raw'
import LastfmSvg from '@/assets/icons/lastfm.svg?raw'

import { loggedInUserIsAdmin } from '../utils'
import lastfm from './lastfm'
import { getT } from '@/i18n'

const { t } = getT()

export default <SettingCategory>{
    title: t("Common.Plugins"),
    show_if: loggedInUserIsAdmin,
    groups: [
        {
            title: t("Common.Lyrics"),
            icon: LyricsSvg,
            desc: t("Settings.Plugins.LyricsDescription"),
            settings: lyrics,
            experimental: true,
        },
        {
            title: t("Settings.Plugins.LastFM.Title"),
            icon: LastfmSvg,
            desc: t("Settings.Plugins.LastFM.Description"),
            settings: lastfm,
        },
    ],
}
