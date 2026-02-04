<template>
    <div ref="leftGroupRef" v-auto-animate class="left-group">
        <HeartSvg
            v-if="settings.use_np_img && !isMobile"
            :state="queue.currenttrack?.is_favorite"
            @handleFav="$emit('handleFav')"
        />
        <div
            v-else
            title="Go to Now Playing"
            class="np-image rounded-sm no-scroll"
            @click="goToNowPlaying"
        >
            <img :src="paths.images.thumb.small + queue.currenttrack?.image" alt="" />
        </div>
        <div
            class="track-info"
            :style="{
                color: getShift(colors.theme1, [0, -170]),
            }"
            @click="goToNowPlaying"
        >
            <div v-tooltip class="title">
                <span class="ellip">
                    {{ queue.currenttrack?.title || 'Hello there' }}
                </span>
                <ExplicitIcon class="explicit-icon" v-if="queue.currenttrack?.explicit" />
                <MasterFlag :bitrate="queue.currenttrack?.bitrate || 0" />
            </div>
            <ArtistName
                :artists="queue.currenttrack?.artists || []"
                :albumartists="queue.currenttrack?.albumartists || 'Welcome to Swing Music'"
                class="artist"
            />
        </div>
        <Actions v-if="isLargerMobile" @handleFav="$emit('handleFav')" />
        <HotKeys v-if="isMobile" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSwipe } from '@vueuse/core'
import { paths } from '@/config'
import { Routes } from '@/router'
import { getShift } from '@/utils/colortools/shift'

import useColorStore from '@/stores/colors'
import { isLargerMobile, isMobile, isMobilePlayerOpen } from '@/stores/content-width'
import useQStore from '@/stores/queue'
import useSettingsStore from '@/stores/settings'

import ArtistName from '@/components/shared/ArtistName.vue'
import HotKeys from '../LeftSidebar/NP/HotKeys.vue'
import HeartSvg from '../shared/HeartSvg.vue'
import MasterFlag from '../shared/MasterFlag.vue'
import Actions from './Right.vue'
import ExplicitIcon from '@/assets/icons/explicit.svg'

const queue = useQStore()
const settings = useSettingsStore()
const colors = useColorStore()
const router = useRouter()
const leftGroupRef = ref<HTMLElement | null>(null)

const { lengthY } = useSwipe(leftGroupRef, {
    onSwipeEnd(e, direction) {
        if (direction === 'UP' && Math.abs(lengthY.value) > 30) {
            goToNowPlaying()
        }
    },
})

defineEmits<{
    (e: 'handleFav'): void
}>()

function goToNowPlaying() {
    if (isMobile.value) {
        isMobilePlayerOpen.value = true
        return
    }

    router.push({
        name: Routes.nowPlaying,
        params: {
            tab: 'home',
        },
    })
}
</script>

<style lang="scss">
.left-group {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: $medium;
    align-items: center;
    font-size: small;
    font-weight: 700;
    line-height: 1.2;
    margin-right: $medium;

    .np-image {
        position: relative;
        height: 3rem;
        cursor: pointer;

        img {
            height: 100%;
        }

        @include largePhones {
            flex-shrink: 0;
            margin-right: $medium;
        }

        @include smallerPhones {
            margin-right: $small;
        }
    }

    .heart-button {
        height: 3rem;
        width: 3rem;
        border: solid 1px $gray4;
        padding: 0;
    }

    .track-info {
        cursor: pointer;

        .title {
            color: $white;
            display: flex;
            align-items: center;
            margin-bottom: 2px;
        }

        .artistname {
            opacity: 0.75;

            a {
                font-size: 0.8rem;
            }
        }

        @include allPhones {
            width: calc(100% + 8px);
        }

        @include largePhones {
            width: unset;
            flex-grow: 1;
        }
    }

    @include allPhones {
        grid-template-columns: max-content 1fr max-content max-content;
        margin-right: unset;

        .heart-button {
            height: max-content;
            border: 1px solid transparent;
        }
    }

    @include largePhones {
        display: flex;
        gap: 0;
        max-width: calc(100% - 8px);
    }
}
</style>

