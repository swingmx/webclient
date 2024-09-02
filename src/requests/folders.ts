import { paths } from '@/config'
import { Folder, Track } from '@/interfaces'
import useAxios from './useAxios'

export async function getFiles(
    path: string,
    start: number,
    limit: number,
    tracks_only = false,
    options: {
        sorttracksby: string
        tracksort_reverse: boolean
        sortfoldersby: string
        foldersort_reverse: boolean
    } = {
        sorttracksby: 'default',
        tracksort_reverse: false,
        sortfoldersby: 'default',
        foldersort_reverse: false,
    }
) {
    interface FolderData {
        tracks: Track[]
        folders: Folder[]
        path: string
        total: number
    }

    const { data, error } = await useAxios({
        url: paths.api.folder.base,
        props: {
            folder: path,
            start,
            limit,
            tracks_only,
            ...options,
        },
    })

    if (error) {
        console.error(error)
    }

    if (data) {
        return data as FolderData
    }

    return <FolderData>{
        path: '',
        tracks: [],
        folders: [],
        total: 0,
    }
}

export async function openInFiles(path: string) {
    const { error } = await useAxios({
        url: paths.api.folder.showInFiles + `?path=${path}`,
        method: 'GET',
    })

    if (error) {
        console.error(error)
    }
}

export async function getTracksInPath(path: string) {
    const { data, error } = await useAxios({
        url: paths.api.folder.base + '/tracks/all' + `?path=${path}`,
        method: 'GET',
    })

    if (error) {
        console.error(error)
    }

    if (data) {
        return data.tracks as Track[]
    }

    return <Track[]>[]
}
