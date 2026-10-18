<template>
    <div class="album-virtual-scroller v-scroll-page" :class="{ isSmall }" style="height: 100%">
        <DynamicScroller
            id="album-scroller"
            style="height: 100%"
            class="scroller"
            :min-item-size="64"
            :items="scrollerItems"
        >
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[item.props]"
                    :data-index="index"
                >
                    <component
                        :is="item.component"
                        :key="index"
                        v-bind="item.props"
                        v-on="listenersFor(item)"
                    ></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'

import { ClassicalWork, Track } from '@/interfaces'

import useAlbumStore from '@/stores/pages/album'
import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'

import AlbumWork from '@/components/Classical/AlbumWork.vue'
import PeopleGrid from '@/components/Classical/PeopleGrid.vue'
import performerGrid from '@/utils/performerGrid'
import AlbumFooter from '@/components/AlbumView/AlbumFooter.vue'
import AlbumDiscBar from '@/components/AlbumView/AlbumDiscBar.vue'
import GenreBanner from '@/components/AlbumView/GenreBanner.vue'
import Header from '@/components/AlbumView/main.vue'
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'
import CardScroller from '@/components/shared/CardScroller.vue'
import SongItem from '@/components/shared/SongItem.vue'
import Stats from '@/components/Stats/Stats.vue'

import { dropSources } from '@/enums'
import { isSmall } from '@/stores/content-width'
import { useT } from '@/i18n'

const { t } = useT()
import useSettingsStore from '@/stores/settings'

const album = useAlbumStore()
const queue = useQueueStore()
const tracklist = useTracklist()
const route = useRoute()
const settings = useSettingsStore()

interface ScrollerItem {
    id: string | undefined
    component:
        | typeof Header
        | typeof SongItem
        | typeof GenreBanner
        | typeof CardScroller
        | typeof AlbumsFetcher
        | typeof Stats
        | typeof AlbumDiscBar
        | typeof AlbumWork
        | typeof PeopleGrid
        | typeof AlbumFooter
    props?: any
}

class songItem {
    id: string | number
    props = {}
    component: typeof SongItem | typeof AlbumDiscBar

    constructor(track: Track, index: number) {
        this.id = track.is_album_disc_number ? `disc-${track.album_page_disc_number}` : `${track.filepath}-${index}`
        this.props = track.is_album_disc_number
            ? { album_disc: track }
            : {
                  track,
                  hide_album: true,
                  index: track.track,
                  source: dropSources.album,
              }
        this.component = track.is_album_disc_number ? AlbumDiscBar : SongItem
    }
}

class workItem {
    id: string | number
    props = {}
    component: typeof AlbumWork

    constructor(work: ClassicalWork, index: number) {
        this.id = `work-${index}-${work.workhash}`
        this.props = {
            work,
            albumhash: album.info.albumhash,
            first: index === 0,
        }
        this.component = AlbumWork
    }
}

// const AlbumVersionsFetcher: ScrollerItem = {
//     id: 'otherVersionsFetcherBanner',
//     component: AlbumsFetcher,
//     props: {
//         fetch_callback: album.fetchAlbumVersions,
//         reset_callback: () => {
//             album.resetOtherVersions()
//             return album.fetchAlbumVersions()
//         },
//         name: 'otherVersions',
//     },
// }

const fetched_similar_hash: ScrollerItem = {
    id: 'similarAlbumsFetcherBanner',
    component: AlbumsFetcher,
    props: {
        fetch_callback: () => album.fetchSimilarAlbums(),
        reset_callback: () => {
            album.resetSimilarAlbums()
            return album.fetchSimilarAlbums()
        },
        name: 'similarAlbums',
    },
}

function getSongItems() {
    return album.tracks.map((track, index) => {
        return new songItem(track, index)
    })
}

function getWorkItems() {
    return album.works.map((work, index) => {
        return new workItem(work, index)
    })
}

function getStatsComponent(): ScrollerItem {
    return {
        id: 'album-stats',
        component: Stats,
        props: {
            items: album.stats,
        },
    }
}
function getArtistAlbumComponents(): ScrollerItem[] {
    // remove keys that have no albums
    const keys = Object.keys(album.artistAlbums).filter(key => album.artistAlbums[key].length > 0)

    const items = keys.map(artisthash => {
        const artist = album.info.albumartists.find(a => a.artisthash === artisthash)
        const artistname = artist?.name

        return {
            id: artisthash,
            component: CardScroller,
            props: {
                items: album.artistAlbums[artisthash].map(album => ({
                    type: 'album',
                    item: album,
                })),
                title: t('Views.AlbumViews.MoreFrom', {art: artistname}),
                route: `/artists/${artisthash}/discography/all?artist=${artistname}`,
            },
        }
    })

    // INFO: sort items by album.info.albumartists order
    return album.info.albumartists
        .map(artist => items.find(item => item.id === artist.artisthash))
        .filter(item => item !== undefined) as ScrollerItem[]
}

function getAlbumVersionsComponent(): ScrollerItem | null {
    if (album.otherVersions.length == 0) return null

    return {
        id: 'otherVersions',
        component: CardScroller,
        props: {
            items: album.otherVersions.map(album => ({
                type: 'album',
                item: album,
            })),
            title: t('Views.AlbumViews.OtherVersions'),
            child_props: {
                hide_artists: true,
            },
            route: `/artists/${album.info.albumartists[0].artisthash}/discography/albums?artist=${album.info.albumartists[0].name}`,
        },
    }
}
const header: ScrollerItem = {
    id: 'album-header',
    component: Header,
}

const genreBanner: ScrollerItem = {
    id: 'genre-banner',
    component: GenreBanner,
    props: {
        source: 'album',
    },
}

const scrollerItems = computed(() => {
    let moreFrom = getArtistAlbumComponents()
    moreFrom = moreFrom.filter(item => item.id !== undefined)
    const otherVersionsComponent = getAlbumVersionsComponent()

    const classical = settings.classical_enabled && album.info.is_classical && album.works.length > 0
    const pageItems = (classical ? getWorkItems() : getSongItems()) as ScrollerItem[]

    if (album.info.date || album.copyright) {
        pageItems.push({
            id: 'album-footer',
            component: AlbumFooter,
            props: { date: album.info.date, copyright: album.copyright },
        })
    }

    if (classical && album.sharedPerformers && album.performers.length) {
        pageItems.push({
            id: 'album-performers',
            component: PeopleGrid,
            props: { title: t('Views.WorkView.Performers'), people: performerGrid(album.performers) },
        })
    }

    let components = [header, ...pageItems, genreBanner]

    // if (album.tracks.length) {
    //     components.push(AlbumVersionsFetcher)
    // }
    if (otherVersionsComponent !== null) {
        components.push(otherVersionsComponent)
    }
    components.push(...moreFrom)

    if (album.tracks.length) {
        components.push(fetched_similar_hash)
    }

    if (album.stats.length) {
        components.push(getStatsComponent())
    }

    if (album.fetched_similar_hash === route.params.albumhash && album.similarAlbums.length) {
        components.push({
            id: 'similarAlbums',
            component: CardScroller,
            props: {
                title: t('Views.AlbumViews.RelatedAlbums'),
                items: album.similarAlbums.map(i => ({
                    type: 'album',
                    item: i,
                })),
            },
        })
    }

    return components
})

function playFromAlbum(index: number, tracks = album.srcTracks) {
    const { title, albumhash } = album.info
    tracklist.setFromAlbum(title, albumhash, tracks, album.works || {})
    queue.play(index)
}

function listenersFor(item: { component: any }) {
    const listeners: Record<string, (...args: any[]) => void> = {}

    if ([SongItem, AlbumWork, Header].includes(item.component)) {
        listeners.playThis = (trackhash?: string) => onPlayThis(item as ScrollerItem, trackhash)
    }

    if (item.component === AlbumDiscBar) {
        listeners.playDisc = playDisc
    }

    return listeners
}

function onPlayThis(item: ScrollerItem, trackhash?: string) {
    if (trackhash) {
        const index = album.srcTracks.findIndex(t => t.trackhash === trackhash)

        if (index < 0) {
            console.warn(`onPlayThis: trackhash ${trackhash} not found in srcTracks`)
            return
        }

        playFromAlbum(index)
        return
    }

    playFromAlbum(item.props.track.master_index)
}

function playDisc(disc_number: number) {
    const tracks = album.srcTracks.filter(t => t.disc == disc_number)
    playFromAlbum(0, tracks)
}

onBeforeRouteUpdate(async to => {
    await album.fetchTracksAndArtists(to.params.albumhash.toString()).then(async () => {
        album.resetAlbumArtists()
        // album.fetchArtistAlbums()

        await nextTick()

        document.getElementById('album-scroller')?.scrollTo({
            top: 0,
        })
    })
})

onBeforeRouteLeave(() => {
    album.resetAll()
})
</script>

<style lang="scss">
.album-virtual-scroller {
    height: 100%;
    overflow: visible;

    .songlist-item {
        grid-template-columns: 1.75rem 1fr 1fr 7.5rem;
    }

    .statshead {
        padding: $medium;
        padding-top: 2rem;
    }
}
</style>
