import { Setting } from '@/interfaces/settings'
import { addRootDirs as editRootDirs, triggerScan } from '@/requests/settings/rootdirs'
import { SettingType } from '../enums'
import { manageRootDirsStrings as data } from '../strings'

import useModalStore from '@/stores/modal'
import settings from '@/stores/settings'
import { getT } from '@/i18n'

const { t } = getT()

const text = data.settings

const change_root_dirs: Setting = {
    title: text.change,
    type: SettingType.button,
    state: null,
    button_text: () => `\xa0 \xa0 ${settings().root_dirs.length ? t("Common.Modify") : t("Common.Configure")} \xa0 \xa0`,
    action: () => useModalStore().showRootDirsPromptModal(),
}

const list_root_dirs: Setting = {
    title: text.list_root_dirs,
    type: SettingType.root_dirs,
    state: () =>
        settings().root_dirs.map(d => ({
            title: d,
            action: () => {
                editRootDirs([], [d]).then(all_dirs => {
                    settings().setRootDirs(all_dirs)
                })
            },
        })),
    defaultAction: () => {},
    action: () => triggerScan(),
}

const show_playlists_in_folders: Setting = {
    title: t("Settings.General.RootDirs.ShowPlaylistInFolders.Title"),
    desc: t("Settings.General.RootDirs.ShowPlaylistInFolders.Description"),
    type: SettingType.binary,
    state: () => settings().show_playlists_in_folders,
    action: () => settings().toggleShowPlaylistsInFolders(),
}

// const enable_scans: Setting = {
//   title: t("Settings.General.RootDirs.EnablePeriodicScans"),
//   type: SettingType.binary,
//   state: () => useSettingsStore().enablePeriodicScans,
//   action: () => useSettingsStore().togglePeriodicScans(),
// };

// const useWatchdog: Setting = {
//   title: t("Settings.General.RootDirs.UseWatchdog"),
//   experimental: true,
//   type: SettingType.binary,
//   state: () => useSettingsStore().enableWatchDog,
//   action: () => useSettingsStore().toggleWatchdog(),
// };

// const periodicScanInterval: Setting = {
//   title: t("Settings.General.RootDirs.PeriodicScanInterval"),
//   type: SettingType.free_number_input,
//   state: () => useSettingsStore().periodicInterval,
//   action: (newValue: number) => useSettingsStore().updatePeriodicInterval(newValue),
// };

export default [
    change_root_dirs,
    list_root_dirs,
    show_playlists_in_folders,
    // useWatchdog, enable_scans, periodicScanInterval
]
