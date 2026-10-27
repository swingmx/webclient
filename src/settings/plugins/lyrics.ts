import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'

import useSettings from '@/stores/settings'
import { useT } from '@/i18n'

const { t } = useT()

const toggle_lyrics_plugin = <Setting>{
    title: t("Settings.Plugins.Lyrics.ToggleLyrics.Title"),
    type: SettingType.binary,
    state: () => useSettings().use_lyrics_plugin,
    action: () => useSettings().toggleLyricsPlugin(),
}

const auto_download_lyrics = <Setting>{
    title: t("Settings.Plugins.Lyrics.AutoDownload.Title"),
    desc:  t("Settings.Plugins.Lyrics.AutoDownload.Description"),
    type: SettingType.binary,
    state: () => useSettings().lyrics_plugin_settings.auto_download,
    action: () => useSettings().toggleLyricsAutoDownload(),
    show_if: () => useSettings().use_lyrics_plugin,
}

const auto_download_on_unsynced = <Setting>{
    title: t("Settings.Plugins.Lyrics.OverrideLocal.Title"),
    desc: t("Settings.Plugins.Lyrics.OverrideLocal.Description"),
    type: SettingType.binary,
    state: () => useSettings().lyrics_plugin_settings.overide_unsynced,
    action: () => useSettings().toggleLyricsOverideUnsynced(),
    show_if: () => {
        const settings = useSettings()
        return settings.use_lyrics_plugin && settings.lyrics_plugin_settings.auto_download
    },
}

const trust_cloud_lyrics = <Setting>{
    title: t('Settings.Plugins.Lyrics.TrustCloud.Title'),
    desc: t('Settings.Plugins.Lyrics.TrustCloud.Desc'),
    type: SettingType.binary,
    state: () => useSettings().trust_cloud_lyrics,
    action: () => useSettings().toggleTrustCloudLyrics(),
    inactive: () => {
        const settings = useSettings()

        return !(settings.use_lyrics_plugin && settings.has_premium)
    },
    premium: true,
}

export default [toggle_lyrics_plugin, auto_download_lyrics, auto_download_on_unsynced, trust_cloud_lyrics]
