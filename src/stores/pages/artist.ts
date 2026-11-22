import { defineStore } from 'pinia'

import {
    ArtistEditData,
    editArtist,
    getArtistAlbums,
    getArtistData,
    getSimilarArtists,
} from '@/requests/artists'
import useCommandPalette from '@/stores/commandPalette'

import { dropPage } from '@/composables/pageCache'
import { paths } from '@/config'
import { Album, Artist, ClassicalPersonPage, Genre, Listening, StatItem, Track } from '@/interfaces'
import { maxAbumCards } from '@/stores/content-width'
import useSettingsStore from '@/stores/settings'
import setColorsToStore from '@/utils/colortools/setColorsToStore'
import { NotifType, useToast } from '@/stores/notification'
import { useT } from '@/i18n'

const { t } = useT()

export interface ArtistEdits {
    artisthash: string
    // a new image, or unset to keep the current one
    image?: Blob
    // the display name, null for the default, or unset to keep it
    name?: string | null
}

let saveQueue: Promise<void> = Promise.resolve()

/**
 * Resolves once `url` is loaded, or failed to load.
 */
function preloadImage(url: string) {
    const img = new Image()
    img.src = url
    return img.decode().catch(() => {})
}

function showError(res: { data?: any }) {
    useToast().showNotification(res.data?.msg || t('Common.NotificationError'), NotifType.Error)
}

export default defineStore('artistPage', {
    state: () => ({
        // which page the hash is; composers and performers fill `person`
        type: <'artist' | 'composer' | 'performer'>'artist',
        person: <ClassicalPersonPage | null>null,
        info: <Artist>{},
        tracks: <Track[]>[],
        albums: <Album[]>[],
        eps: <Album[]>[],
        compilations: <Album[]>[],
        singles: <Album[]>[],
        appearances: <Album[]>[],
        similar_artists: <Artist[]>[],
        colors: {
            bg: '',
            btn: '',
        },
        fetched_similar_hash: '',
        stats: <StatItem[]>[],
        listening: <Listening | null>null,
        // a local image shown until its upload is saved
        imageOverride: <string | null>null,
    }),
    getters: {
        imageUrl(): string {
            return this.imageOverride || paths.images.artist.large + this.info.image
        },
    },
    actions: {
        async getData(hash: string, query: Record<string, string> = {}) {
            const settings = useSettingsStore()
            const data = await getArtistData(hash, settings.artist_top_tracks_count, maxAbumCards.value, query)

            if (data && data.type !== 'artist') {
                this.type = data.type
                this.person = data
                // the artist editor works on `info`, so it edits this person rather than the last artist
                if (data.artisthash !== this.info.artisthash) this.imageOverride = null
                this.info = <Artist>{ artisthash: data.artisthash, name: data.name, image: data.image ?? '' }
                return
            }

            this.type = 'artist'
            this.person = null
            if (data.artist?.artisthash !== this.info.artisthash) this.imageOverride = null
            const { artist, tracks, stats, albums, listening } = data
            this.listening = listening ?? null
            this.info = artist
            this.tracks = tracks

            this.setAlbums(albums)
            this.setStats(stats)
            this.extractColors()
        },
        setAlbums(srcalbums: { [key: string]: Album[] }) {
            const { albums, singles_and_eps, appearances, compilations } = srcalbums

            this.albums = albums
            this.singles = singles_and_eps
            this.appearances = appearances
            this.compilations = compilations
        },
        setStats(stats: StatItem[]) {
            this.stats = []
            this.stats = stats
        },
        async fetchSimilarArtists() {
            if (this.fetched_similar_hash === this.info.artisthash) return
            this.fetched_similar_hash = this.info.artisthash
            this.similar_artists = await getSimilarArtists(this.info.artisthash, maxAbumCards.value)
        },
        extractColors() {
            setColorsToStore(this, this.imageUrl, true)
        },
        setBgColor() {
            const colors = this.info.color
            this.colors.bg = colors ? colors : ''
        },
        resetAlbums() {
            this.colors.bg = ''
            this.albums = []
            this.eps = []
            this.singles = []
        },
        resetSimilarArtists() {
            this.similar_artists = []
        },
        /**
         * Shows the edits on the page straight away, then saves them after any earlier edits.
         * Each edit that fails to save is reverted.
         */
        applyEdits(edits: ArtistEdits) {
            const hash = edits.artisthash
            const isCurrent = () => this.info.artisthash === hash
            const before = {
                image: this.info.image,
                color: this.info.color,
                blurhash: this.info.blurhash,
                display_name: this.info.display_name,
            }

            const blobUrl = edits.image ? URL.createObjectURL(edits.image) : null

            if (blobUrl) {
                this.imageOverride = blobUrl
                this.extractColors()
            }
            if (edits.name !== undefined) this.info.display_name = edits.name

            // whether the page still shows what this edit set
            const showsImage = () => isCurrent() && this.imageOverride === blobUrl
            const showsName = () => isCurrent() && this.info.display_name === edits.name

            const save = async () => {
                const data = edits.name === undefined ? {} : { display_name: edits.name }
                const res = await editArtist(hash, data, edits.image)
                const saved = res.status === 200

                if (!saved) showError(res)

                if (blobUrl) {
                    if (saved) await preloadImage(paths.images.artist.large + res.data.image)

                    if (showsImage()) {
                        const { image, color, blurhash } = saved ? res.data : before
                        Object.assign(this.info, { image, color, blurhash })
                        this.imageOverride = null
                        this.extractColors()
                    }

                    if (this.imageOverride !== blobUrl) URL.revokeObjectURL(blobUrl)
                }

                if (edits.name !== undefined && showsName()) {
                    this.info.display_name = saved ? res.data.display_name : before.display_name
                }
            }

            saveQueue = saveQueue.then(save, save)
            return saveQueue
        },
        /**
         * Creates, edits or deletes a collective, then updates the open artist page to match.
         * Returns whether it was saved.
         */
        async saveCollective(hash: string, data: ArtistEditData, image?: Blob) {
            const res = await editArtist(hash, data, image)

            if (res.status !== 200) {
                showError(res)
                return false
            }

            useCommandPalette().load()

            const saved = res.data
            const members: string[] = saved.members ?? []
            const before = this.info.artisthash === hash ? (this.info.members ?? []).map(m => m.artisthash) : []

            // cached pages of old and new members would come back with a stale collective pill
            for (const member of new Set([...before, ...members])) dropPage(`/artists/${member}`)

            if (this.info.artisthash === hash) {
                if (saved.deleted) return true
                // the collective's own tracks and albums changed with its members
                this.imageOverride = null
                await this.getData(hash)
            } else if (!this.info.members) {
                // an artist's page is open: add, update or remove this collective's pill in place
                const others = (this.info.collectives ?? []).filter(c => c.artisthash !== hash)
                const pill = <Artist>{ artisthash: hash, name: saved.name, image: saved.image }
                const collectives = members.includes(this.info.artisthash) ? [...others, pill] : others

                this.info.collectives = collectives.length ? collectives : undefined
            }

            return true
        },
        makeFavorite() {
            this.info.is_favorite = true
        },
        removeFavorite() {
            this.info.is_favorite = false
        },
    },
})
