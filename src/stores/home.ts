import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { getHomePageData, getRecentlyAdded, getRecentlyPlayed } from '@/requests/home'
import { maxAbumCards } from './content-width'
import { Routes, router } from '@/router'
import { HomePageItem } from '@/interfaces'

export default defineStore('homepage', () => {
    const recentlyAddedCutoff = ref(0)
    const recentlyAddedFetched = ref(false)
    const recentlyPlayedFetched = ref(false)

    type itemlist = { type: string; item?: any; with_helptext?: boolean }[]
    const homepageData = reactive({
        artist_mixes: <HomePageItem>{
            items: [],
        },
        recently_added: <HomePageItem>{},
        recently_played: <HomePageItem>{},
    })

    // with_helptext is used to enable enable the help text box on the content loader

    const recentlyAdded = ref(<itemlist>[])
    const recentlyPlayed = ref(<itemlist>[])

    async function fetchAll() {
        const data = await getHomePageData()
        homepageData.artist_mixes = data.artist_mixes
    }

    async function fetchRecentlyAdded() {
        recentlyAddedFetched.value = false
        const data = await getRecentlyAdded(maxAbumCards.value)
        recentlyAdded.value = data.items
        recentlyAddedCutoff.value = data.cutoff
        recentlyAddedFetched.value = true
    }

    async function fetchRecentlyPlayed() {
        recentlyPlayedFetched.value = false
        const data = await getRecentlyPlayed(maxAbumCards.value)

        // setTimeout(() => {
        recentlyPlayed.value = data.items
        recentlyPlayedFetched.value = true
        // }, 3000)
    }

    function resetAll() {
        setTimeout(() => {
            if (router.currentRoute.value.name == Routes.Home) return
            ;[recentlyAdded.value, recentlyPlayed.value] = [[], []]
        }, 5000)
    }

    return {
        recentlyAddedCutoff,
        recentlyAdded,
        recentlyPlayed,
        recentlyAddedFetched,
        recentlyPlayedFetched,
        homepageData,
        fetchRecentlyAdded,
        fetchRecentlyPlayed,
        resetAll,
        fetchAll,
    }
})
