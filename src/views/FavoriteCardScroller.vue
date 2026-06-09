<template>
    <CardGridPage :page="itemtype" :items="items" :fetch_callback="() => loadMore()" :more-items="waitingForMore">
        <template #header>
            <GenericHeader>
                <template #name
                    >Favorite <span style="text-transform: capitalize">{{ itemtype }}s</span>
                </template>
                <template #description
                    >You have {{ itemtype == 'album' ? albumCount : artistCount }} favorited
                    {{ itemtype + (items.length == 1 ? '' : 's') }}</template
                >
            </GenericHeader>
        </template>
    </CardGridPage>
</template>

<script setup lang="ts">
import { Routes } from '@/router'
import { useRoute } from 'vue-router'
import { computed, onMounted, Ref, ref } from 'vue'

import { Album, Artist } from '@/interfaces'
import { getFavAlbums, getFavArtists } from '@/requests/favorite'

import CardGridPage from './SearchView/CardGridPage.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const route = useRoute()

const albumCount = ref(0)
const artistCount = ref(0)

const waitingForMore = computed(() => {
    // return true if the count is less than the length of the items
    if (route.name == Routes.favoriteAlbums) {
        return albumCount.value > 0 && albums.value.length < albumCount.value
    }

    return artistCount.value > 0 && artists.value.length < artistCount.value
})

const albums: Ref<Album[]> = ref([])
const artists: Ref<Artist[]> = ref([])

const itemtype = computed(() => {
    if (route.name == Routes.favoriteAlbums) {
        return 'album'
    }

    return 'artist'
})

const items = computed(() => {
    if (itemtype.value == 'album') {
        return albums.value
    }

    return artists.value
})

async function loadMore(initialize?: boolean) {
    let counter: number

    if (itemtype.value == 'artist') {
        counter = artistCount.value
    } else {
        counter = albumCount.value
    }

    // if (waitingForMore || (counter && counter <= items.value.length)) return
    if (!initialize && !waitingForMore.value) return

    // start at the end of the current items
    const limit = 50
    const start = items.value.length
    const data = await (itemtype.value == 'artist' ? getFavArtists(start, limit) : getFavAlbums(start, limit))

    if (data.total !== -1) {
        if (itemtype.value == 'artist') {
            artistCount.value = data.total
        } else {
            albumCount.value = data.total
        }
    }

    if (itemtype.value == 'artist') {
        artists.value.push(...(data as any).artists)
    } else {
        albums.value.push(...(data as any).albums)
    }
}

onMounted(async () => {
    await loadMore(true)
})
</script>
