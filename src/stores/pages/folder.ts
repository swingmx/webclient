import { defineStore } from 'pinia'
import { ComputedRef } from 'vue'

import { useFuse } from '@/utils'

import { FuseTrackOptions } from '@/enums'
import { Folder, FuseResult, Track } from '@/interfaces'
import { getFiles } from '@/requests/folders'
import { Routes, router } from '@/router'
import { track_limit } from '../content-width'

export default defineStore('FolderDirs&Tracks', {
    state: () => ({
        query: '',
        path: <string>{},
        allDirs: <Folder[]>[],
        allTracks: <Track[]>[],
        trackTotal: 0,
        trackSortBy: 'playcount',
        folderSortBy: 'default',
        trackSortReverse: true,
        folderSortReverse: true,
    }),
    actions: {
        async fetchAll(fpath: string, restart?: boolean) {
            const { tracks, folders, path, total } = await getFiles(
                fpath,
                restart ? 0 : this.allTracks.length,
                track_limit.value,
                !restart && this.allTracks.length > 0,
                {
                    sorttracksby: this.trackSortBy,
                    tracksort_reverse: this.trackSortReverse,
                    sortfoldersby: this.folderSortBy,
                    foldersort_reverse: this.folderSortReverse,
                }
            )

            if (restart || this.path !== fpath) {
                this.allTracks = []
                this.allDirs = []
                this.trackTotal = 0
            }

            this.path = fpath

            // If the requested path was redirected, update store path
            if (path !== fpath) {
                fpath = path
            }

            this.trackTotal = total
            ;[this.path, this.allDirs] = [fpath, folders]
            this.allTracks = this.allTracks.concat(tracks)
        },
        setFolderTrackSortKey(key: string) {
            // INFO: If the key is the same as the current key, reverse the sort order
            if (key === this.trackSortBy) {
                this.trackSortReverse = !this.trackSortReverse
            } else {
                this.trackSortBy = key
                this.trackSortReverse = true
            }

            this.fetchAll(this.path, true)
        },
        resetQuery() {
            this.query = ''
        },
        resetAll() {
            setTimeout(() => {
                if (router.currentRoute.value.name == Routes.folder) return
                ;[this.allDirs, this.allTracks] = [[], []]
                this.resetQuery()
            }, 5000)
        },
    },
    getters: {
        filteredTracks(): ComputedRef<FuseResult[]> {
            return useFuse(this.query, this.allTracks, FuseTrackOptions)
        },
        tracks(): Track[] {
            const tracks = this.filteredTracks.value.map((result: FuseResult) => {
                const t = {
                    ...result.item,
                    index: result.refIndex,
                }

                return t
            })

            return tracks
        },
        dirs(): Folder[] {
            const dirs = useFuse(this.query, this.allDirs, {
                keys: ['name'],
            })

            return dirs.value.map(result => {
                return result.item
            })
        },
    },
    persist: {
        paths: ['trackSortBy', 'trackSortReverse', 'folderSortBy', 'folderSortReverse'],
        storage: localStorage,
    }
})
