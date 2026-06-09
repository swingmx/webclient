<template>
    <div class="now-playing-header">
        <div class="top">
            <RouterLink :to="sourceData.location">
                {{ sourceData.name }}
            </RouterLink>
        </div>
        <div class="centered">
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
                <ImageLoader
                    :image="paths.images.thumb.original + queue.currenttrack?.image"
                    :blurhash="queue.currenttrack?.blurhash"
                    :duration="1000"
                />
            </RouterLink>
        </div>
        <div class="below">
            <NowPlayingInfo @handle-fav="handleFav" />
            <Progress v-if="isMobile" />
            <div class="below-progress">
                <div v-if="isMobile" class="time">
                    {{ formatSeconds(queue.duration.current) }}
                </div>
                <Buttons v-if="isSmallPhone" :hide-heart="true" @handleFav="() => {}" />
                <div v-if="isMobile" class="time">
                    {{ formatSeconds(queue.duration.full) }}
                </div>
            </div>
        </div>
        <!-- <TrackContext /> -->
        <!-- <h3 v-if="queue.next" class="nowplaying_title">Up Next</h3>
        <SongItem
            v-if="queue.next"
            :track="queue.next"
            :index="queue.nextindex + 1"
            :source="dropSources.folder"
            @play-this="queue.playNext"
        />
        <h3 class="nowplaying_title">Queue</h3> -->
    </div>
</template>

<script setup lang="ts">
import { paths } from '@/config'
import { dropSources, favType } from '@/enums'
import favoriteHandler from '@/helpers/favoriteHandler'
import { Routes } from '@/router'
import { isMobile, isSmallPhone } from '@/stores/content-width'
import useQueueStore from '@/stores/queue'
import { formatSeconds } from '@/utils'

import Progress from '@/components/LeftSidebar/NP/Progress.vue'
import Buttons from '../BottomBar/Right.vue'
import SongItem from '../shared/SongItem.vue'
import NowPlayingInfo from './NowPlayingInfo.vue'
import PlayingFrom from './PlayingFrom.vue'
import TrackContext from './TrackContext.vue'
import { From } from '@/stores/queue/tracklist'
import playingFrom from '@/utils/playingFrom'
import { computed } from 'vue'
import ImageLoader from '../shared/ImageLoader.vue'

const props = defineProps<{
    source: From
}>()

const queue = useQueueStore()
const sourceData = computed(() => {
    const { name, location } = playingFrom(props.source)
    return { name, location }
})

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

    display: grid;
    place-items: stretch;
    justify-items: center;
    grid-template-rows: 1fr max-content 1fr;

    @include largePhones {
        padding: 1.5rem !important;
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

        /* Somehow has to be replaced by above now
        @include largePhones {
            padding-left: 0.5rem;
        }
        */
    }

    .below-progress {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;

        .time {
            font-size: $medium;
            font-weight: 500;
            background-color: $gray3;
            padding: 1px $smaller;
            min-width: 2.5rem;
            text-align: center;
            border-radius: $smaller;
            font-variant-numeric: tabular-nums;
        }

        /* Responsive */
        @include allPhones {
            .right-group button.speaker {
                border-top: 1px solid transparent !important;
                border-top-left-radius: 0 !important;
                border-top-right-radius: 0 !important;
            }
        }

        @include smallestPhones {
            position: relative;
            flex-direction: column;
            align-items: unset;
            gap: $small;

            .time:first-child {
                align-self: baseline;
                margin-left: 4px;
            }

            .time:last-child {
                align-self: end;
                position: absolute;
                top: 0;
                right: 4px;
            }

            .right-group {
                width: 100% !important;
                display: flex;
                justify-content: space-between;
            }
        }
    }

    $image-size: auto;

    .centered {
        margin: 0 auto;
        width: 100%;
        // max-width: $image-size;
    }

    .image-loader {
        // height: $image-size;

        img {
            border-radius: $small;
        }
    }

    .below {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        // width: min(100%, $image-size);
    }

    .top {
        display: flex;
        align-items: flex-end;
        padding-bottom: 1rem;
        opacity: 0.75;
        font-size: 14px;
    }

    .np-image {
        position: relative;
        margin-bottom: 1rem;

        img {
            width: 100%;
            height: 100%;
            aspect-ratio: 1;
            object-fit: cover;
        }
    }

    #progress {
        margin-top: 1rem;
        margin-right: 0;

        &::-moz-range-thumb {
            height: 0.8rem;
        }

        &::-webkit-slider-thumb {
            height: 0.8rem;
        }

        &::-ms-thumb {
            height: 0.8rem;
        }
    }

    @include allPhones {
        margin-left: 0;
        padding: 0 1rem;
        display: block;
        padding: 2rem !important;

        .top {
            opacity: 0;
        }
    }

    @include largePhones {
        .np-image {
            display: block;
            width: 90% !important;
            margin: 0 auto;
        }
    }
}
</style>
