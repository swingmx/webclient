import { loggedInUserIsAdmin } from '../utils'
import useSettings from '@/stores/settings'

import { SettingCategory } from '@/interfaces/settings'
import * as strings from '../strings'
import contextChildrenShowMode from './context-children-show-mode'
import extendWidth from './extend-width'
import nowPlaying from './now-playing-group'
import sidebarSettings from './sidebar'
import rootDirSettings from './root-dirs'
import albums from './albums'
import separators from './separators'
import tracks from './tracks'
import circularArtistImg from './circular-artist-img'
import layout from './layout'
import folderlistmode from './folderlistmode'

// icons
import AppearanceSvg from '@/assets/icons/paintbrush.svg?raw'
import FolderSvg from '@/assets/icons/folder.svg?raw'
import TrackSvg from '@/assets/icons/mic.svg?raw'
import AlbumSvg from '@/assets/icons/album.svg?raw'
import AvatarSvg from '@/assets/icons/artist.svg?raw'

const npStrings = strings.nowPlayingStrings
const rootRootStrings = strings.manageRootDirsStrings

export const general = {
    // title: 'General',
    groups: [
        {
            title: 'Appearance',
            desc: 'Settings for various parts of the user interface.',
            icon: AppearanceSvg,
            settings: [
                ...layout,
                ...extendWidth,
                ...sidebarSettings,
                circularArtistImg,
                ...contextChildrenShowMode,
                ...folderlistmode,
                ...nowPlaying,
            ],
        },
    ],
} as SettingCategory

export const library = {
    title: 'Library',
    show_if: loggedInUserIsAdmin,
    groups: [
        {
            title: rootRootStrings.title,
            icon: FolderSvg,
            desc: rootRootStrings.desc,
            settings: [...rootDirSettings],
        },
        {
            // null means settings table is not created yet
            show_if: () => useSettings().feat !== null,
            title: 'Tracks',
            icon: TrackSvg,
            desc: 'Settings relating to track information',
            settings: [...tracks],
        },
        {
            // null means settings table is not created yet
            show_if: () => useSettings().feat !== null,
            title: 'Albums',
            icon: AlbumSvg,
            desc: 'Settings relating to album information',
            settings: [...albums],
        },
        {
            // null means settings table is not created yet
            show_if: () => useSettings().feat !== null,
            title: 'Artists',
            icon: AvatarSvg,
            desc: 'Customize artist separators',
            settings: [separators],
        },
    ],
} as SettingCategory

// ENHANCEMENT: Decouple components from Group.vue and pass them as part of the Setting interface (maybe?)
