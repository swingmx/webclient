import { ComputedRef } from 'vue'
import { defineStore } from 'pinia'

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
    }),
    actions: {
        async fetchAll(fpath: string) {
            console.log('fpath', fpath)
            console.log('this.path', this.path)

            const { tracks, folders, path } = await getFiles(
                fpath,
                this.allTracks.length,
                this.allTracks.length + track_limit.value
            )

            if (this.path !== fpath) {
                this.allDirs = []
                this.allTracks = []
            }

            this.path = fpath

            // If the requested path was redirected, update store path
            if (path !== fpath) {
                fpath = path
            }

            ;[this.path, this.allDirs] = [fpath, folders]
            this.allTracks = this.allTracks.concat(tracks)
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
})
