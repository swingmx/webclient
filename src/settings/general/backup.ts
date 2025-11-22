import { Setting } from '@/interfaces/settings'
import { SettingType } from '../enums'
import { getT } from '@/i18n'

const { t } = getT()

const automatic_backups: Setting = {
    title: t("Settings.General.Backups.AutomaticBackups.Title"),
    desc: t("Settings.General.Backups.AutomaticBackups.Description"),
    type: SettingType.binary,
    state: () => false,
    action: () => {},
    inactive: () => true,
}

const restore: Setting = {
    title: t("Settings.General.Backups.BackupNow.Title"),
    desc: t("Settings.General.Backups.BackupNow.Description"),
    type: SettingType.backup,
    state: () => true,
    action: () => {},
}

export default [automatic_backups, restore]
