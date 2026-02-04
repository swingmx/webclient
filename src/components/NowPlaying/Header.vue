<template>
    <div class="now-playing-header">
        <div class="centered">
            <div class="header-row">
                <PlayingFrom />
            </div>
            <RouterLink
                :to="{
                    name: Routes.album,
                    params: {
                        albumhash: queue.currenttrack?.albumhash || ' ',
                    },
                }"
                title="Go to Album"
                class="np-image"
            >
                <img v-motion-fade class="rounded" :src="paths.images.thumb.large + queue.currenttrack?.image" />
            </RouterLink>
            <NowPlayingInfo @handle-fav="handleFav" />
            
            <div class="below-progress">
             <!-- Desktop progress/time usually handled in bottom bar, 
                  but NowPlaying view might show it. 
                  Checking original file: header included PlayingFrom, Image, Info, Progress (if Mobile), 
                  and .below-progress (if Mobile). 
                  
                  Since we are fixing DESKTOP view, and desktop has BottomBar always visible,
                  we probably don't need progress/controls here at all? 
                  The original file had `Progress v-if="isMobile"`.
                  So for desktop, it was just Image + Info + Up Next.
             -->
            </div>
        </div>
        <h3 class="nowplaying_title" v-if="queue.next">Up Next</h3>
        <SongItem
            v-if="queue.next"
            :track="queue.next"
            :index="queue.nextindex + 1"
            :source="dropSources.folder"
            @play-this="queue.playNext"
        />
        <h3 class="nowplaying_title">Queue</h3>
    </div>
</template>

<script setup lang="ts">
import { paths } from '@/config'
import { dropSources, favType } from '@/enums'
import favoriteHandler from '@/helpers/favoriteHandler'
import { Routes } from '@/router'
import useQueueStore from '@/stores/queue'

import SongItem from '../shared/SongItem.vue'
import NowPlayingInfo from './NowPlayingInfo.vue'
import PlayingFrom from './PlayingFrom.vue'

const queue = useQueueStore()

function handleFav() {
    favoriteHandler(
        queue.currenttrack?.is_favorite,
        favType.track,
        queue.currenttrack?.trackhash || '',
        () => null,
        () => null
    )
}
</script>

<style lang="scss">
.now-playing-view.isSmall .now-playing-header .nowplaying_title {
    padding-left: 0.5rem;
}

.now-playing-header {
    padding-bottom: $smaller;
    position: relative;

    .header-row {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
    }

    .nowplaying_title {
        padding-left: 1rem;
        margin: 1.25rem 0;

        &:last-child {
            padding-top: $large;
            margin: 1rem 0;
        }

        @media only screen and (max-width: 724px) {
            padding-left: 0.5rem;
        }
    }

    .centered {
        margin: 0 auto;
        width: 26rem;
        max-width: 100%;
        padding: 0 1rem;
    }

    .np-image {
        position: relative;
        margin-bottom: 1rem;
        display: block;

        img {
            width: 100%;
            height: auto;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: $medium;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    }
}
</style>
