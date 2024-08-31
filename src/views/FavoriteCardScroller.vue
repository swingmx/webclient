<template>
    <CardGridPage :page="itemtype" :items="items" :fetch_callback="() => loadMore()">
        <template #header>
            <GenericHeader>
                <template #name
                    >Favorite <span style="text-transform: capitalize">{{ itemtype }}s</span></template
                >
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

let albumCount = 0
let artistCount = 0
let waitingForMore = false

const route = useRoute()
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

async function loadMore() {
    let counter: number

    if (itemtype.value == 'artist') {
        counter = artistCount
    } else {
        counter = albumCount
    }

    if (waitingForMore || (counter && counter <= items.value.length)) return

    waitingForMore = true
    const start = items.value.length ? 50 + items.value.length : 0
    const data = await (itemtype.value == 'artist' ? getFavArtists(start, 50) : getFavAlbums(start, 50))

    if (data.total !== -1) {
        if (itemtype.value == 'artist') {
            artistCount = data.total
        } else {
            albumCount = data.total
        }
    }

    if (itemtype.value == 'artist') {
        artists.value.push(...(data.artists as Artist[]))
    } else {
        albums.value.push(...(data.albums as Album[]))
    }

    waitingForMore = false
}

onMounted(async () => {
    await loadMore()
})
</script>
