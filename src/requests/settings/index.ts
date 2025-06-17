import { paths } from '@/config'
import { DBSettings } from '@/enums'
import useAxios from '../useAxios'

export async function getAllSettings() {
    const { data, status } = await useAxios({
        url: paths.api.settings.base,
        method: 'GET',
    })

    const settings = data as DBSettings

    return { settings, status }
}

export async function updateConfig(key: string, value: any) {
    return await useAxios({
        url: paths.api.settings.updateConfig,
        method: 'PUT',
        props: {
            key,
            value,
        },
    })
}

// SECTION: BACKUPS

export async function getBackups() {
    interface Backup {
        name: string
        playlists: number
        scrobbles: number
        favorites: number
        collections: number
        date: string
    }

    const { data, status } = await useAxios({
        url: paths.api.backups.get_backups,
        method: 'GET',
    })

    return data.backups as Backup[]
}

export async function restoreBackup(backup_dir?: string) {
    return await useAxios({
        url: paths.api.backups.restore_backup,
        method: 'POST',
        props: {
            backup_dir,
        },
    })
}

export async function backupNow() {
    return await useAxios({
        url: paths.api.backups.create_backup,
        method: 'POST',
    })
}

export async function deleteBackup(backup_dir: string) {
    return await useAxios({
        url: paths.api.backups.delete_backup,
        method: 'DELETE',
        props: {
            backup_dir,
        },
    })
}
