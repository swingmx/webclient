import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'

import useSettingsStore from '@/stores/settings'
import { getT } from '@/i18n'

const { t } = getT()

const settings = useSettingsStore

const clean_album_titles: Setting = {
    title: t("Settings.General.Albums.CleanTitles.Title"),
    desc: t("Settings.General.Albums.CleanTitles.Description"),
    type: SettingType.binary,
    state: () => settings().clean_titles,
    action: () => settings().toggleCleanAlbumTitle(),
}

const merge_album_versions: Setting = {
    title: t("Settings.General.Albums.MergeAlbum.Title"),
    desc: t("Settings.General.Albums.MergeAlbum.Description"),
    type: SettingType.binary,
    state: () => {
        const settings = useSettingsStore()
        return settings.clean_titles && settings.merge_albums
    },
    action: () => settings().toggleMergeAlbums(),
    inactive: () => !settings().clean_titles,
}

const show_albums_as_singles: Setting = {
    title: t('Settings.General.Albums.AlbumAsSingles.Title'),
    desc: t("Settings.General.Albums.AlbumAsSingles.Description"),
    type: SettingType.binary,
    state: () => settings().show_albums_as_singles,
    action: () => settings().toggleShowAlbumsAsSingles(),
}

export default [clean_album_titles, merge_album_versions, show_albums_as_singles]
