import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'

const automatic_backups: Setting = {
    title: 'Automatic backups',
    desc: 'Automatically backup your favorites, playlists and scrobble data',
    type: SettingType.binary,
    state: () => true,
    action: () => {},
    inactive: () => true,
}

const restore: Setting = {
    title: 'Backup now',
    desc: 'Backup directory: ~/swingmusic.backups',
    type: SettingType.backup,
    state: () => true,
    action: () => {},
}

export default [automatic_backups, restore]
