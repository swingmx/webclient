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
import { getT } from '@/i18n'

const { t } = getT()

const npStrings = strings.nowPlayingStrings
const rootRootStrings = strings.manageRootDirsStrings

export const general = {
    // title: 'General',
    groups: [
        {
            title: t("Common.Appearance"),
            desc: t("Settings.General.MainSettingsDescription"),
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
    title: t("Common.Library"),
    show_if: loggedInUserIsAdmin,
    groups: [
        {
            title: t("Common.Folders"),
            icon: FolderSvg,
            desc: rootRootStrings.desc,
            settings: [...rootDirSettings],
        },
        {
            // null means settings table is not created yet
            show_if: () => useSettings().feat !== null,
            title: t("Common.Track", 2),
            icon: TrackSvg,
            desc: t("Settings.General.TrackInfoSettingsDesc"),
            settings: [...tracks],
        },
        {
            // null means settings table is not created yet
            show_if: () => useSettings().feat !== null,
            title: t("Common.Album", 2),
            icon: AlbumSvg,
            desc: t("Settings.General.AlbumInfoSettingsDesc"),
            settings: [...albums],
        },
        {
            // null means settings table is not created yet
            show_if: () => useSettings().feat !== null,
            title: t("Common.Artist", 2),
            icon: AvatarSvg,
            desc: t("Settings.General.ArtistSeparatorDesc"),
            settings: [separators],
        },
        {
            title: t("Common.Backup"),
            icon: AvatarSvg,
            desc: t("Settings.General.BackupMainDesc"),
            settings: [...restore],
        }
    ],
} as SettingCategory

// ENHANCEMENT: Decouple components from Group.vue and pass them as part of the Setting interface (maybe?)
