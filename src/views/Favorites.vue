<template>
    <div class="content-page favorites-page">
        <GenericHeader>
            <template #name>{{ $t('Views.Favorites.Title') }}</template>
            <template #description
                >{{ $t("Views.Favorites.CountStats", {tra: count.tracks, alb: count.albums, art: count.artists}) }}</template
            >
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
                :tracks="favTracks"
                :route="'/favorites/tracks'"
                :title="$t('Common.Track', 2)"
                :play-handler="handlePlay"
                :source="dropSources.favorite"
                :total="count.tracks"
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

        <NoItems :flag="noFavs" :icon="HeartSvg" :title="$t('Views.Favorites.NoFavoritesFound')" :description="$t('Views.Favorites.Description')" />
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, Ref, ref } from 'vue'

import { maxAbumCards, updateCardWidth } from '@/stores/content-width'

import { dropSources, playSources } from '@/enums'
import { playFromFavorites } from '@/helpers/usePlayFrom'
import { Album, Artist, RecentFavResult, Track, WorkRow } from '@/interfaces'
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
const favArtists: Ref<Artist[]> = ref([])
const favWorks: Ref<WorkRow[]> = ref([])
const favComposers: Ref<Artist[]> = ref([])
const count = ref({
    albums: 0,
    tracks: 0,
    artists: 0,
})
const noFavs = ref(false)

onMounted(() => {
    updatePageTitle(t('Views.Favorites.Title'))
    const max = maxAbumCards.value

    getAllFavs(6, max, max, max * 2)
        .then(favs => {
            recentFavs.value = favs.recents
            favAlbums.value = favs.albums
            favTracks.value = favs.tracks
            favArtists.value = favs.artists
            favWorks.value = favs.works ?? []
            favComposers.value = favs.composers ?? []
            count.value = favs.count
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
    const track = favTracks.value[index]
    if (!track) return
    playFromFavorites(track)
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
