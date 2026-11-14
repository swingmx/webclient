import { defineStore } from 'pinia'
import { markRaw } from 'vue'

import { getBaseUrl, paths } from '@/config'
import type { WorkerRequest, WorkerResponse } from '@/workers/commandPalette'

/**
 * The server's compact search index.
 * artists: [hash, name, display name, blurhash, image query, album positions in artist page order]
 * albums: [hash, title, first version, year, blurhash, album artist positions]
 */
export interface SearchIndex {
    artists: [string, string, string, string, string, number[]][]
    albums: [string, string, string, number, string, number[]][]
}

export interface PaletteArtist {
    type: 'artist'
    hash: string
    name: string
    blurhash: string
    image: string
    albums: PaletteAlbum[]
}

export interface PaletteAlbum {
    type: 'album'
    hash: string
    name: string
    version: string
    year: number
    blurhash: string
    artists: PaletteArtist[]
}

export type PaletteItem = PaletteArtist | PaletteAlbum

let worker: Worker | null = null
let artists: PaletteArtist[] = []
let albums: PaletteAlbum[] = []
let searchId = 0

const RELOAD_AFTER = 5 * 60 * 1000
let loadedAt = 0

function toItems(index: SearchIndex) {
    artists = index.artists.map(([hash, name, displayName, blurhash, image]) => ({
        type: 'artist' as const,
        hash,
        name: displayName || name,
        blurhash,
        image,
        albums: [],
    }))

    albums = index.albums.map(([hash, name, version, year, blurhash, owners]) => ({
        type: 'album' as const,
        hash,
        name,
        version,
        year,
        blurhash,
        artists: owners.map(i => artists[i]),
    }))

    index.artists.forEach(([, , , , , order], i) => (artists[i].albums = order.map(j => albums[j])))
}

export default defineStore('commandPalette', {
    state: () => ({
        visible: false,
        ready: false,
        results: markRaw([]) as PaletteItem[],
    }),
    actions: {
        /**
         * Loads the index in the worker; again later to pick up library changes.
         */
        load() {
            if (!worker) {
                worker = new Worker(new URL('../workers/commandPalette.ts', import.meta.url), { type: 'module' })
                worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => this.onMessage(data)
            }
            loadedAt = Date.now()
            this.post({ type: 'load', url: (getBaseUrl() || window.location.origin) + paths.api.search.index })
        },
        post(message: WorkerRequest) {
            worker?.postMessage(message)
        },
        onMessage(data: WorkerResponse) {
            if (data.type === 'index') {
                toItems(data.index)
                this.ready = true
                if (this.visible) this.search('')
            }

            // drop answers to queries already typed past
            if (data.type === 'results' && data.id === searchId) {
                this.results = markRaw(data.hits.map(([kind, i]) => (kind === 0 ? artists[i] : albums[i])))
            }
        },
        search(q: string) {
            searchId++
            if (!q.trim()) {
                this.results = markRaw(artists.slice(0, 20))
                return
            }
            this.post({ type: 'search', id: searchId, q: q.trim() })
        },
        open() {
            this.visible = true
            this.search('')
            if (this.ready && Date.now() - loadedAt > RELOAD_AFTER) this.load()
        },
        close() {
            this.visible = false
        },
        toggle() {
            this.visible ? this.close() : this.open()
        },
    },
})
