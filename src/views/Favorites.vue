<template>
    <div class="content-page favorites-page">
        <GenericHeader>
            <template #name>{{ $t('Views.Favorites.Title') }}</template>
            <template #description>{{
                $t('Views.Favorites.CountStats', { tra: count.tracks, alb: count.albums, art: count.artists })
            }}</template>
        </GenericHeader>
        <CardScroller
            v-if="recentFavs.length"
            class="recent-favs"
            :items="recentFavs"
            :title="$t('Common.Recents')"
            :play-source="playSources.favorite"
        />
        <div v-if="favTracks.length" class="fav-tracks">
            <TopTracks
                :tracks="shownTracks"
                :route="split ? `/favorites/tracks?kind=${trackTab}` : '/favorites/tracks'"
                :title="$t('Common.Track', 2)"
                :play-handler="handlePlay"
                :source="dropSources.favorite"
                :total="shownTotal"
                :tabs="split ? trackTabs : undefined"
                :active-tab="trackTab"
                :classical="trackTab === 'classical'"
                :empty="
                    trackTab === 'classical'
                        ? {
                              title: $t('Views.Favorites.NoClassical'),
                              description: $t('Views.Favorites.NoClassicalDescription'),
                          }
                        : undefined
                "
                @switch-tab="id => (trackTab = id as FavTrackKind)"
            />
        </div>
        <br />
        <CardScroller
            v-if="favAlbums.length"
            :items="favAlbums.map(i => ({ type: 'album', item: i }))"
            :title="$t('Common.Album', 2)"
            :route="'/favorites/albums'"
        />

        <CardScroller
            v-if="favArtists.length"
            :items="favArtists.map(i => ({ type: 'artist', item: i }))"
            :title="$t('Common.Artist', 2)"
            :route="'/favorites/artists'"
        />

        <WorkList
            v-if="favWorks.length"
            artisthash=""
            :title="$t('Views.Favorites.Works')"
            :works="favWorks"
            :filters="[]"
            filter-key=""
            :filter="null"
            :show-composer="true"
            :compact="true"
            :max-rows="2"
            :more-to="{ name: Routes.favoriteWorks }"
        />

        <CardScroller
            v-if="favComposers.length"
            :items="favComposers.map(i => ({ type: 'artist', item: i }))"
            :title="$t('Views.Favorites.Composers')"
            :route="'/favorites/composers'"
        />

        <NoItems
            :flag="noFavs"
            :icon="HeartSvg"
            :title="$t('Views.Favorites.NoFavoritesFound')"
            :description="$t('Views.Favorites.Description')"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, Ref, ref } from 'vue'

import { maxAbumCards, updateCardWidth } from '@/stores/content-width'

import { dropSources, playSources } from '@/enums'
import { playFromFavorites } from '@/helpers/usePlayFrom'
import { Album, Artist, FavTrackKind, RecentFavResult, Track, WorkRow } from '@/interfaces'
import { getAllFavs } from '@/requests/favorite'
import { Routes } from '@/router'
import updatePageTitle from '@/utils/updatePageTitle'

import HeartSvg from '@/assets/icons/heart-no-color.svg'
import TopTracks from '@/components/ArtistView/TopTracks.vue'
import WorkList from '@/components/Classical/WorkList.vue'
import CardScroller from '@/components/shared/CardScroller.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import NoItems from '@/components/shared/NoItems.vue'
import { useT } from '@/i18n'

const { t } = useT()

const recentFavs: Ref<RecentFavResult[]> = ref([])
const favAlbums: Ref<Album[]> = ref([])
const favTracks: Ref<Track[]> = ref([])
// with classical support on, the tracks tabs split favorites into plain tracks and movements
const split = ref(false)
// rows each tracks tab shows
const TRACK_LIMIT = 6
const trackTab = ref<FavTrackKind>('tracks')
const favArtists: Ref<Artist[]> = ref([])
const favWorks: Ref<WorkRow[]> = ref([])
const favComposers: Ref<Artist[]> = ref([])
const count = ref({
    albums: 0,
    tracks: 0,
    artists: 0,
    plain_tracks: 0,
    classical_tracks: 0,
})

const trackTabs = computed(() => [
    { id: 'tracks', label: t('Views.Favorites.Tracks') },
    { id: 'classical', label: t('Views.Favorites.Classical') },
    { id: 'all', label: t('Views.Favorites.AllTracks') },
])

const shownTracks = computed(() => {
    const tracks =
        !split.value || trackTab.value === 'all'
            ? favTracks.value
            : favTracks.value.filter(track => track.is_classical === (trackTab.value === 'classical'))
    return tracks.slice(0, TRACK_LIMIT)
})

const shownTotal = computed(() => {
    if (!split.value || trackTab.value === 'all') return count.value.tracks
    return trackTab.value === 'classical' ? count.value.classical_tracks : count.value.plain_tracks
})
const noFavs = ref(false)

onMounted(() => {
    updatePageTitle(t('Views.Favorites.Title'))
    const max = maxAbumCards.value

    getAllFavs(TRACK_LIMIT, max, max, max * 2)
        .then(favs => {
            recentFavs.value = favs.recents
            favAlbums.value = favs.albums
            favTracks.value = favs.tracks
            split.value = favs.count.classical_tracks !== undefined
            // open on the movements when there are no plain tracks
            if (split.value && !favs.count.plain_tracks && favs.count.classical_tracks) trackTab.value = 'classical'
            favArtists.value = favs.artists
            favWorks.value = favs.works ?? []
            favComposers.value = favs.composers ?? []
            count.value = { plain_tracks: 0, classical_tracks: 0, ...favs.count }
        })
        .then(() => {
            noFavs.value =
                !favAlbums.value.length &&
                !favTracks.value.length &&
                !favArtists.value.length &&
                !favWorks.value.length &&
                !favComposers.value.length
        })
        .then(async () => {
            await nextTick()
            updateCardWidth()
        })
})

function handlePlay(index: number) {
    const track = shownTracks.value[index]
    if (!track) return
    playFromFavorites(track, split.value ? trackTab.value : 'all')
}
</script>

<style lang="scss">
.favorites-page {
    height: 100%;
    overflow: auto;

    .recent-favs {
        padding-top: 1rem;
    }

    .nothing h3 {
        margin-top: 3rem;
    }

    .fav-tracks {
        h3 {
            margin-top: 0;
        }

        .artist-top-tracks {
            h3 {
                padding-right: $small;
            }
        }
    }
}
</style>
