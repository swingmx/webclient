import { paths } from '@/config'
import { Folder } from '@/interfaces'
import { NotifType, useToast } from '@/stores/notification'
import useAxios from '../useAxios'

const { add_root_dir, get_root_dirs, remove_root_dir } = paths.api.settings

export async function getRootDirs() {
    const { data, error } = await useAxios({
        url: get_root_dirs,
        method: 'GET',
    })

    if (error) {
        return []
    }

    return data.dirs as string[]
}

export async function addRootDirs(new_dirs: string[], removed: string[]) {
    const { error, data } = await useAxios({
        url: add_root_dir,
        props: { new_dirs, removed },
    })

    if (error) {
        useToast().showNotification('Error adding root dirs', NotifType.Error)
        return []
    }

    useToast().showNotification(
        'Root directories configured',
        NotifType.Success
    )

    return data.root_dirs as string[]
}

export async function removeRootDirs(dirs: string[]) {
    const { error } = await useAxios({
        url: remove_root_dir,
        props: { dirs },
    })

    if (error) {
        useToast().showNotification('Error removing root dirs', NotifType.Error)
    }
}

export async function getFolders(folder: string = '$home') {
    const { data, error } = await useAxios({
        url: paths.api.dir_browser,
        props: {
            folder,
        },
    })

    if (error) {
        return []
    }
    return data.folders as Folder[]
}

export async function triggerScan() {
    const { error } = await useAxios({
        url: paths.api.settings.trigger_scan,
        method: 'GET',
    })

    if (error) {
        useToast().showNotification('Error triggering scan', NotifType.Error)
        return
    }

    useToast().showNotification('Rescan started', NotifType.Success)
}
