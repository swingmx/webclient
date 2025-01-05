<template>
    <div v-auto-animate class="left-group">
        <HeartSvg
            v-if="settings.use_np_img && !isMobile"
            :state="queue.currenttrack?.is_favorite"
            @handleFav="$emit('handleFav')"
        />
        <RouterLink
            v-else
            title="Go to Now Playing"
            :to="{
                name: Routes.nowPlaying,
                params: {
                    tab: 'home',
                },
                replace: true,
            }"
            class="np-image rounded-sm no-scroll"
        >
            <img :src="paths.images.thumb.small + queue.currenttrack?.image" alt="" />
            <div class="expandicon">
                <ExpandSvg />
            </div>
        </RouterLink>
        <div
            class="track-info"
            :style="{
                color: getShift(colors.theme1, [0, -170]),
            }"
        >
            <div v-tooltip class="title">
                <span class="ellip">
                    {{ queue.currenttrack?.title || 'Hello there' }}
                </span>
                <ExplicitIcon class="explicit-icon" v-if="queue.currenttrack?.explicit" />
                <MasterFlag :bitrate="queue.currenttrack?.bitrate + 3000 || 0" />
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
import { paths } from '@/config'
import { Routes } from '@/router'
import { getShift } from '@/utils/colortools/shift'

import useColorStore from '@/stores/colors'
import { isLargerMobile, isMobile } from '@/stores/content-width'
import useQStore from '@/stores/queue'
import useSettingsStore from '@/stores/settings'

import ExpandSvg from '@/assets/icons/expand.svg'
import ArtistName from '@/components/shared/ArtistName.vue'
import HotKeys from '../LeftSidebar/NP/HotKeys.vue'
import HeartSvg from '../shared/HeartSvg.vue'
import MasterFlag from '../shared/MasterFlag.vue'
import Actions from './Right.vue'
import ExplicitIcon from '@/assets/icons/explicit.svg'

const queue = useQStore()
const settings = useSettingsStore()
const colors = useColorStore()

defineEmits<{
    (e: 'handleFav'): void
}>()
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

        img {
            height: 100%;
        }

        .expandicon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(51, 51, 51, 0.6);

            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease-out, height 0.2s ease-out, transform 0.2s ease-out,
                background-color 0.2s ease-out;

            svg {
                transform: rotate(-90deg) scale(0.92);
            }
        }

        &:hover {
            .expandicon {
                transform: translateY(-$medium);
                height: 130%;
            }
        }

        &:active {
            .expandicon {
                background-color: rgba(51, 51, 51, 0.74);
            }
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
