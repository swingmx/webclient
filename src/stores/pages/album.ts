import { defineStore } from 'pinia'
import { ComputedRef } from 'vue'

import { getAlbum, getAlbumsFromArtist, getAlbumVersions, getSimilarAlbums } from '@/requests/album'

import { paths } from '@/config'
import { FuseTrackOptions } from '@/enums'
import { Album, AlbumDisc, FuseResult, StatItem, Track } from '@/interfaces'
import { router, Routes } from '@/router'
import { maxAbumCards } from '@/stores/content-width'
import { useFuse } from '@/utils'
import setColorsToStore from '@/utils/colortools/setColorsToStore'
import { useToast } from '../notification'

interface Disc {
    [key: string]: Track[]
}

function sortByTrackNumber(tracks: Track[]) {
    return tracks.sort((a, b) => {
        if (a.track && b.track) {
            return a.track - b.track
        }

        return 0
    })
}

/**
 *
 * @param tracks The raw tracklist from the server
 * @returns A list of `Disc` objects
 */
function createDiscs(tracks: Track[]) {
    return tracks.reduce((group, track) => {
        const { disc } = track

        group[disc] = group[disc] ?? []
        group[disc].push(track)

        return group
    }, {} as Disc)
}

export default defineStore('album', {
    state: () => ({
        query: '',
        info: <Album>{},
        copyright: '',
        extra: <
            {
                track_total: number
                avg_bitrate: number
            }
        >{},
        srcTracks: <Track[]>[],
        artistAlbums: <{
            [key: string]: Album[]
        }>{},
        otherVersions: <Album[]>[],
        similarAlbums: <Album[]>[],
        bio: null,
        discs: <Disc>{},
        colors: {
            bg: '',
            btn: '',
        },
        fetched_similar_hash: '',
        fetched_version_hash: '',
        fetched_other_hash: '',
        stats: <StatItem[]>[],
    }),
    actions: {
        /**
         * Fetches a single album information, artists and its tracks from the server
         * using the title and album-artist of the album.
         * @param albumhash title of the album
         */
        async fetchTracksAndArtists(albumhash: string) {
            const album = await getAlbum(albumhash, maxAbumCards.value)

            this.srcTracks = album.tracks
            this.info = album.info
            this.copyright = album.copyright
            this.extra = album.extra
            this.stats = album.stats
            this.artistAlbums = album.more_from
            this.otherVersions = album.other_versions
            this.extractColors()

            const tracks = sortByTrackNumber(this.srcTracks)
            this.discs = createDiscs(tracks)

            this.srcTracks = Object.keys(this.discs).reduce((tracks: Track[], disc) => {
                const disc_tracks = this.discs[disc]

                return [...tracks, ...disc_tracks]
            }, [])

            this.srcTracks.forEach((t, index) => {
                t.master_index = index
            })

            this.extractColors()
        },
        // async fetchArtistAlbums() {
        //     if (this.fetched_other_hash == this.info.albumhash) return

        //     this.fetched_other_hash = this.info.albumhash
        //     this.artistAlbums = await getAlbumsFromArtist(
        //         this.info.albumartists.map(a => a.artisthash),
        //         maxAbumCards.value,
        //         this.info.base_title
        //     )
        // },
        // async fetchAlbumVersions() {
        //     if (this.fetched_version_hash == this.info.albumhash) return

        //     this.fetched_version_hash = this.info.albumhash
        //     this.otherVersions = await getAlbumVersions(
        //         this.info.og_title,
        //         this.info.albumhash,
        //     )
        // },
        async fetchSimilarAlbums() {
            if (this.fetched_similar_hash === this.info.albumhash) return

            this.fetched_similar_hash = this.info.albumhash
            this.similarAlbums = await getSimilarAlbums(this.info.albumartists[0].artisthash, maxAbumCards.value)
        },
        extractColors() {
            const url = paths.images.thumb.small + this.info.image
            setColorsToStore(this, url)
        },
        resetQuery() {
            this.query = ''
        },
        resetAlbumArtists() {
            setTimeout(() => {
                if (router.currentRoute.value.name == Routes.album) return
                this.artistAlbums = {}
                this.fetched_other_hash = ''
            }, 10000)
        },
        resetOtherVersions() {
            this.otherVersions = []
            this.fetched_version_hash = ''
        },
        resetSimilarAlbums() {
            this.similarAlbums = []
            this.fetched_similar_hash = ''
        },
        makeFavorite() {
            this.info.is_favorite = true
        },
        removeFavorite() {
            this.info.is_favorite = false
        },
        resetAll() {
            setTimeout(() => {
                if (router.currentRoute.value.name == Routes.album) return
                this.resetAlbumArtists()
                this.resetOtherVersions()
                this.resetSimilarAlbums()
            }, 5000)
        },
    },
    getters: {
        filteredTracks(): ComputedRef<FuseResult[]> {
            const discs = this.discs
            let tracks: Track[] | AlbumDisc[] = []

            Object.keys(discs).forEach(disc => {
                const discHeader = {
                    is_album_disc_number: true,
                    album_page_disc_number: parseInt(disc),
                } as AlbumDisc

                tracks = [...tracks, discHeader, ...discs[disc]]
            })

            return useFuse(this.query, tracks, FuseTrackOptions)
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
    },
})

// TODO: Implement Disc interface using a class
