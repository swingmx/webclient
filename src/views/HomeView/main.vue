<template>
    <div class="homepageview content-page">
        <GenericHeader>
            <template #name>Home</template>
            <template #description>{{ getGreetings(auth.user.username) }}</template>
        </GenericHeader>
        <Browse />

        <PageItem
            v-for="item in home.homepageItems"
            :title="item.title || ''"
            :description="item.description"
            :items="item.items"
            :play-source="playSources.mix"
            :route="item.path"
            :see-all-text="item.seeAllText"
        />
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import useAuth from '@/stores/auth'

import { playSources } from '@/enums'
import { updateCardWidth } from '@/stores/content-width'
import useHome from '@/stores/home'
import updatePageTitle from '@/utils/updatePageTitle'

import Browse from '@/components/HomeView/Browse.vue'
import PageItem from '@/components/shared/CardScroller.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const home = useHome()
const auth = useAuth()

function getGreetings(username: string) {
    username = username ? username : ''

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
    await home.fetchAll()
    await nextTick()
    updateCardWidth()
})
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
