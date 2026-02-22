import lyrics from './lyrics'
import lastfm from './lastfm'
import { loggedInUserIsAdmin } from '../utils'
import { SettingCategory } from '@/interfaces/settings'

import LyricsSvg from '@/assets/icons/lyrics.svg?raw'
import LastfmSvg from '@/assets/icons/lastfm.svg?raw'

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
    ],
}
