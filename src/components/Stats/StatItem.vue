<template>
    <div class="statitem" :class="props.icon">
        <svg
            class="noise"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.dev/svgjs"
            viewBox="0 0 700 700"
        >
            <defs>
                <filter
                    id="nnnoise-filter"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    filterUnits="objectBoundingBox"
                    primitiveUnits="userSpaceOnUse"
                    color-interpolation-filters="linearRGB"
                >
                    <feTurbulence
                        type="turbulence"
                        baseFrequency="0.05"
                        numOctaves="4"
                        seed="15"
                        stitchTiles="stitch"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        result="turbulence"
                    ></feTurbulence>
                    <feSpecularLighting
                        surfaceScale="21"
                        specularConstant="1.7"
                        specularExponent="20"
                        lighting-color="#7957A8"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        in="turbulence"
                        result="specularLighting"
                    >
                        <feDistantLight azimuth="3" elevation="84"></feDistantLight>
                    </feSpecularLighting>
                </filter>
            </defs>
            <rect width="700" height="700" fill="transparent"></rect>
            <rect width="700" height="700" fill="#7957a8" filter="url(#nnnoise-filter)"></rect>
        </svg>
        <div class="itemcontent">
            <div class="count ellip2">{{ formattedValue }}</div>
            <div class="title">{{ text }}</div>
        </div>

        <component :is="icon" class="staticon" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import StopWatchSvg from '@/assets/icons/timer.svg'
import HeadphoneSvg from '@/assets/icons/headphones.svg'
import FolderSvg from '@/assets/icons/folder.nopad.svg'
import Index1Svg from '@/assets/icons/index1.svg'

const props = defineProps<{
    value: string
    text: string
    icon: string
}>()

const icon = computed(() => {
    switch (props.icon) {
        case 'streams':
            return HeadphoneSvg
        case 'playtime':
            return StopWatchSvg

        case 'trackcount':
            return FolderSvg

        case 'toptrack':
            return Index1Svg

        default:
            return HeadphoneSvg
    }
})

const formattedValue = computed(() => {
    return props.value.toLocaleString()
})
</script>

<style lang="scss">
.statitem {
    // background-color: $gray2;
    // padding: 1rem;
    border-radius: 1rem;
    height: 12rem;
    aspect-ratio: 1;
    overflow: hidden;

    background-image: linear-gradient(to top right, rgb(120, 76, 129), #9643da91, rgb(132, 80, 228));
    position: relative;

    &.streams {
        background-image: linear-gradient(to top, #c79081 0%, #dfa579 100%);
    }

    &.playtime {
        background-image: linear-gradient(-225deg, #3d4e81 0%, #5753c9 48%, #6e7ff3 100%);
    }

    &.trackcount {
        background-image: linear-gradient(to top, #6a66b9 0%, #7777db 52%, #7b7bd4 100%);
    }

    &.toptrack {
        background-image: linear-gradient(-225deg, #65379b 0%, #6750b3 53%, #6457c6 100%);
    }

    .itemcontent {
        position: relative;
        z-index: 1;
        height: 100%;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        gap: $small;

        .count {
            font-size: 1.55rem;
            font-weight: 900;
        }

        .title {
            font-size: 14px;
            font-weight: 500;
        }
    }

    .staticon {
        position: absolute;
        top: 1rem;
        left: 1rem;
        width: 1.5rem;
        z-index: 1;
    }

    svg.noise {
        position: absolute;
        top: 0;
        left: 0;
    }
}

.statitem.toptrack {
    aspect-ratio: 1.5;
}
</style>
