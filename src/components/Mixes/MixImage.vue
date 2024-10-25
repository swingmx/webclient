<template>
    <div class="miximage rounded-sm no-scroll" :class="{ on_header }">
        <div
            class="infooverlay"
            :style="{
                color: getTextColor(mix.images[0].color),
            }"
        >
            <div class="type" :style="{ color: getTypeColor(mix.images[0].color) }">{{ mix.extra['type'] }} mix</div>
            <div class="title ellip">{{ mix.title }}</div>
        </div>
        <img class="rounded-sm" :src="paths.images.artist.large + mix.extra['artisthash'] + '.webp'" />
        <div
            class="gradient rounded-sm"
            :style="{
                background: `linear-gradient(27deg, ${mix.images[0].color} 21%, ${addOpacity(
                    mix.images[0].color,
                    0.15
                )}),linear-gradient(-17deg, ${mix.images[0].color} 10%, ${addOpacity(mix.images[0].color, 0)} 30%)`,
            }"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { paths } from '@/config'
import { Mix } from '@/interfaces'
import { addOpacity } from '@/utils/colortools/shift'
import { getTextColor } from '@/utils/colortools/shift'
import { getTypeColor } from '@/utils/colortools'

defineProps<{
    mix: Mix
    on_header?: boolean
}>()
</script>

<style lang="scss">
.miximage {
    position: relative;
    aspect-ratio: 1;

    .gradient {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
    }

    .infooverlay {
        position: absolute;
        bottom: $small;
        z-index: 1;
        left: $small;

        .type {
            font-size: 0.9rem;
            font-weight: 900;
            text-transform: capitalize;
            // color: rgb(109, 69, 16) !important;
        }

        .title {
            font-size: 1.25rem;
            font-weight: 900;
        }
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.miximage.on_header {
    height: 100%;

    img,
    .gradient {
        border-radius: 1rem;
    }

    .infooverlay {
        padding: $small;

        .type {
            font-size: 1.25rem;
            font-weight: 900;
        }

        .title {
            font-size: 2rem;
            font-weight: 900;
        }
    }
}
</style>
