<template>
    <div class="homepageview content-page">
        <GenericHeader>
            <template #name>Home</template>
            <template #description>{{ getGreetings(auth.user.username) }}</template>
        </GenericHeader>
        <Browse />
        <RecentItems
            v-if="!home.recentlyPlayedFetched || home.recentlyPlayed.length > 0"
            :title="'Recently Played'"
            :items="home.recentlyPlayed"
            :play-source="playSources.track"
            :route="'/playlist/recentlyplayed'"
            :see-all-text="'VIEW HISTORY'"
        />
        <RecentItems
            v-if="!home.recentlyAddedFetched || home.recentlyAdded.length > 0"
            :title="'Recently Added'"
            :items="home.recentlyAdded"
            :play-source="playSources.recentlyAdded"
            :route="'/playlist/recentlyadded'"
        />
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import useAuth from '@/stores/auth'

import { playSources } from '@/enums'
import { updateCardWidth } from '@/stores/content-width'
import useHome from '@/stores/home'
import updatePageTitle from '@/utils/updatePageTitle'

import Browse from '@/components/HomeView/Browse.vue'
import RecentItems from '@/components/shared/CardScroller.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const home = useHome()
const auth = useAuth()

function getGreetings(username: string) {
    const date = new Date()
    const hour = date.getHours()

    if (hour <= 3) {
        return 'Hey there night owl'
    } else if (hour <= 5) {
        return 'Hey there early bird'
    } else if (hour <= 12) {
        return 'Good morning ' + username
    } else if (hour <= 17) {
        return 'Good afternoon ' + username
    } else {
        return 'Goooood evening ' + username
    }
}

onMounted(async () => {
    updatePageTitle('Home')
    await home.fetchRecentlyPlayed()
    nextTick().then(updateCardWidth)
    await home.fetchRecentlyAdded()
})

// onBeforeRouteLeave(() => home.resetAll())
</script>

<style lang="scss">
.homepageview {
    height: 100%;
    overflow: auto;

    .generichead {
        margin-bottom: 0;
    }
}
</style>
