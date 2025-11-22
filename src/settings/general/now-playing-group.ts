import { getT } from '@/i18n'
import { SettingType } from '../enums'
import { Setting } from '@/interfaces/settings'

import useSettingsStore from '@/stores/settings'

const { t } = getT()

const settings = useSettingsStore

const disable_np_img: Setting = {
    title: t("Settings.General.NowPlaying.DisableNPTitle"),
    type: SettingType.binary,
    state: () => !settings().use_np_img,
    action: () => settings().toggleUseNPImg(),
    show_if: () => !settings().is_alt_layout,
}

const showNowPlayingOnTabTitle: Setting = {
    title: t("Settings.General.NowPlaying.OnTabTitle.Title"),
    desc: t("Settings.General.NowPlaying.OnTabTitle.Description"),
    type: SettingType.binary,
    state: () => settings().nowPlayingTrackOnTabTitle,
    action: () => settings().toggleNowPlayingTrackOnTabTitle(),
}

const showInlineFavIcon: Setting = {
    title: t("Settings.General.NowPlaying.FavoriteInline.Title"),
    desc: t('Settings.General.NowPlaying.FavoriteInline.Description'),
    type: SettingType.binary,
    state: () => settings().showInlineFavIcon,
    action: () => settings().toggleShowInlineFavIcon(),
}

const highlightFavoriteTracks: Setting = {
    title: t("Settings.General.NowPlaying.HighlightFavorite.Title"),
    desc: t("Settings.General.NowPlaying.HighlightFavorite.Description"),
    type: SettingType.binary,
    state: () => settings()._highlightFavoriteTracks,
    action: () => settings().toggleHighlightFavoriteTracks(),
    show_if: () => settings().showInlineFavIcon,
}

export default [disable_np_img, showNowPlayingOnTabTitle, showInlineFavIcon, highlightFavoriteTracks]
