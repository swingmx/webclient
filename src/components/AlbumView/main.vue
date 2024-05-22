<template>
    <div
        class="album-header-ambient rounded-lg"
        style="height: 100%; width: 100%"
        :style="{
            boxShadow:
                // hide shadow on small screen
                isSmallPhone ? '' : colors.bg
                    ? `0 .5rem 2rem ${colors.bg}`
                    : '0 .5rem 2rem black',
        }"
    ></div>
    <div
        ref="albumheaderthing"
        class="a-header rounded-lg"
        :style="{
            // hide background on small screen
            background: isSmallPhone ? '' : colors.bg ? colors.bg : '',
        }"
    >
        <div
            class="big-img no-scroll"
            :class="`${isHeaderSmall ? 'imgSmall' : ''} shadow-lg rounded-sm`"
        >
            <img
                :src="imguri.thumb.large + album.image"
                class="rounded-sm"
            />
        </div>
        <Info />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { paths } from '@/config'
import { isHeaderSmall, isSmallPhone } from '@/stores/content-width'

import useNavStore from '@/stores/nav'
import useAlbumStore from '@/stores/pages/album'

import Info from '@/components/AlbumView/Header/Info.vue'
import useVisibility from '@/utils/useVisibility'

const albumheaderthing = ref<any>(null)
const imguri = paths.images

const nav = useNavStore()
const store = useAlbumStore()

const { info: album, colors } = storeToRefs(store)

defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: 'playThis'): void
}>()

function handleVisibilityState(state: boolean) {
    nav.toggleShowPlay(state)
}

useVisibility(albumheaderthing, handleVisibilityState)
</script>

<style lang="scss">
.balance-text-temp {
    visibility: hidden;
    position: absolute;
    top: -9999px;
    left: -9999px;
}

.album-header-ambient {
    width: 20rem;
    position: absolute;
    z-index: -100 !important;
    opacity: 0.25;
}

.a-header {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 1rem;
    padding: 1rem;
    height: $banner-height;
    // background-color: $black;
    align-items: flex-end;

    .big-img {
        height: 16rem;
        display: flex;
        align-items: flex-end;

        img {
            height: 16rem;
            max-width: 16rem;
            object-fit: contain;
        }
    }

    .big-img.imgSmall {
        width: 12rem;
        height: 12rem;

        img {
            height: 12rem;
        }
    }

    .nocontrast {
        color: $black;

        .top {
            .albumtype {
                color: $pink;
            }
        }
    }

    @include largePhones {
        grid-template-columns: 1fr;
        padding: 2rem 1rem;
        height: 25rem;

        .big-img {
            width: 14rem !important;
            height: 14rem !important;
            aspect-ratio: 1;
            margin: 0 auto;

            img {
                height: 14rem !important;
            }
        }

        .title {
            font-size: 1.5rem !important;
            max-width: fit-content;
            margin: 0 auto;
            text-align: center;
        }

        .album-buttons {
            justify-content: center;
        }

        .album-stats > div {
            border: none;
            margin: $small auto;
        }

        .versions {
            margin-bottom: 0 !important;
            margin-left: 0 !important;
            text-align: center;
        }
    }
}
</style>
