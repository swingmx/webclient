import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { getHomePageData } from '@/requests/home'
import { HomePageItem } from '@/interfaces'
import { maxAbumCards } from './content-width'

export default defineStore('homepage', () => {
    const homepageData = reactive(<HomePageItem[]>{})

    const homepageItems = computed(() => {
        const items = Object.values(homepageData).filter(item => item.items.length > 0)
        items.sort((a, b) => a.position - b.position)

        return items
    })

    const routes = {
        recently_played: '/playlist/recentlyplayed',
        artist_mixes: '/mixes/artist',
        custom_mixes: '/mixes/track',
        // top_streamed_weekly_artists: '',
        // top_streamed_monthly_artists: '/featured-mixes',
        recently_added: '/playlist/recentlyadded',
    }

    const seeAllTexts = {
        recently_played: 'VIEW HISTORY',
    }

    async function fetchAll() {
        const data: { [key: string]: HomePageItem }[] = await getHomePageData(maxAbumCards.value)
        let keys = []

        for (const [index, item] of data.entries()) {
            const key = Object.keys(item)[0]
            keys.push(key)
            // @ts-ignore
            homepageData[key] = item[key]
            // @ts-ignore
            homepageData[key].position = index
            // @ts-ignore
            homepageData[key].path = routes[key]
            // @ts-ignore
            homepageData[key].seeAllText = seeAllTexts[key]

            if (item[key].url) {
                // @ts-ignore
                homepageData[key].path = item[key].url
            }
        }

        // remove keys not in response
        for (const key in homepageData) {
            if (!keys.includes(key)) {
                delete homepageData[key]
            }
        }
    }

    return {
        homepageData,
        homepageItems,
        fetchAll,
    }
})
