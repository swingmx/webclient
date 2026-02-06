import lyrics from './lyrics'
import useAuth from '@/stores/auth'
import { SettingCategory } from '@/interfaces/settings'

import LyricsSvg from '@/assets/icons/lyrics.svg?raw'
import LastfmSvg from '@/assets/icons/lastfm.svg?raw'
import KeySvg from '@/assets/icons/key.svg?raw'

import { loggedInUserIsAdmin } from '../utils'
import lastfm from './lastfm'
import { SettingType } from '../enums'

export default <SettingCategory>{
    title: 'Plugins',
    show_if: loggedInUserIsAdmin,
    groups: [
        {
            title: 'Lyrics',
            icon: LyricsSvg,
            desc: 'Finds and displays lyrics from the internet.',
            settings: lyrics,
            experimental: true,
        },
        {
            title: 'Last.fm',
            icon: LastfmSvg,
            desc: 'Scrobble your music to Last.fm',
            settings: lastfm,
        },
        {
            title: 'Subscription',
            desc: 'Manage your subscription, license keys and authorized devices',
            displayName: 'Subscription and License Settings',
            icon: KeySvg,
            settings: [
                {
                    type: SettingType.license,
                },
            ],
        },
    ],
}
