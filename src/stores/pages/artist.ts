import { defineStore } from 'pinia'

import { getArtistAlbums, getArtistData, getSimilarArtists } from '@/requests/artists'

import { paths } from '@/config'
import { Album, Artist, ClassicalPersonPage, Genre, Listening, StatItem, Track } from '@/interfaces'
import { Routes, router } from '@/router'
import { maxAbumCards } from '@/stores/content-width'
import useSettingsStore from '@/stores/settings'
import setColorsToStore from '@/utils/colortools/setColorsToStore'

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
    }),
    actions: {
        async getData(hash: string, query: Record<string, string> = {}) {
            const settings = useSettingsStore()
            const data = await getArtistData(hash, settings.artist_top_tracks_count, maxAbumCards.value, query)

            if (data && data.type !== 'artist') {
                this.type = data.type
                this.person = data
                return
            }

            this.type = 'artist'
            this.person = null
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
            const url = paths.images.artist.large + this.info.image
            setColorsToStore(this, url, true)
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
        resetAll() {
            setTimeout(() => {
                if (router.currentRoute.value.name == Routes.artist) return
                this.resetAlbums()
                this.resetSimilarArtists()
                this.fetched_similar_hash = ''
                this.stats = []
            }, 5000)
        },
        makeFavorite() {
            this.info.is_favorite = true
        },
        removeFavorite() {
            this.info.is_favorite = false
        },
    },
})
