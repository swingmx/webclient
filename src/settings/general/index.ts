import useSettings from '@/stores/settings'
import { loggedInUserIsAdmin } from '../utils'

import { SettingCategory } from '@/interfaces/settings'
import * as strings from '../strings'
import albums from './albums'
import restore from './backup'
import circularArtistImg from './circular-artist-img'
import contextChildrenShowMode from './context-children-show-mode'
import extendWidth from './extend-width'
import folderlistmode from './folderlistmode'
import layout from './layout'
import nowPlaying from './now-playing-group'
import rootDirSettings from './root-dirs'
import separators from './separators'
import sidebarSettings from './sidebar'
import tracks from './tracks'
// icons
import AlbumSvg from '@/assets/icons/album.svg?raw'
import AvatarSvg from '@/assets/icons/artist.svg?raw'
import FolderSvg from '@/assets/icons/folder.svg?raw'
import TrackSvg from '@/assets/icons/mic.svg?raw'
import AppearanceSvg from '@/assets/icons/paintbrush.svg?raw'

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
            title: "Root directories",
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
        {
            title: "Backup",
            icon: AvatarSvg,
            desc: "Backup and restore your settings",
            settings: [...restore],
        }
    ],
} as SettingCategory

// ENHANCEMENT: Decouple components from Group.vue and pass them as part of the Setting interface (maybe?)
