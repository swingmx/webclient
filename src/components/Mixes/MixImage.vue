<template>
    <div class="miximage" :class="{ on_header }">
        <div
            class="infooverlay"
            v-if="!mix.extra['image']"
            :style="{
                color: getTextColor(mix.extra.images?.[0]?.color || ''),
            }"
        >
            <div class="type" :style="{ color: getTypeColor(mix.extra.images?.[0]?.color || '') }">
                {{ mix.extra['type'] }} mix
            </div>
            <div class="title ellip">{{ mix.title.replace('Radio', '') }}</div>
        </div>
        <img
            class="main"
            :src="getImageUrl(mix.extra['image']?.image || '', false)"
            v-if="mix.extra['image']"
            :key="mix.extra['image']['image']"
        />
        <div class="images" v-else>
            <img
                v-for="image in mix.extra['images']"
                class="shadow-sm"
                :src="getImageUrl(image, true)"
                :key="image['image']"
            />
        </div>
        <div
            class="gradient rounded-sm"
            v-if="!mix.extra['image']"
            :style="{
                background: gradient,
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
import { onMounted, ref } from 'vue'

const props = defineProps<{
    mix: Mix
    on_header?: boolean
}>()

const gradient = ref('')

async function getGradient() {
    let color = props.mix.extra.image?.color

    if (!color) {
        color = props.mix.extra.images?.[0]?.color
    }

    if (color) {
        return `linear-gradient(27deg, ${color} 21%, ${addOpacity(
            color,
            0.15
        )}),linear-gradient(-17deg, ${color} 10%, ${addOpacity(color, 0)} 30%)`
    }

    return ''
}

function getImageUrl(image: any, is_extra: boolean = false) {
    if (is_extra) {
        if (image['type'] == 'artist') {
            return paths.images.artist.medium + image['image']
        }

        return paths.images.thumb.medium + image['image']
    }

    if (props.on_header) {
        return paths.images.mix.medium + image
    }

    return paths.images.mix.medium + image
}

onMounted(async () => {
    gradient.value = await getGradient()
})
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
            font-size: 1.15rem;
            font-weight: 900;
        }
    }

    .main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.59rem;
    }

    .images {
        border-radius: 0.59rem;
        overflow: hidden;
        height: 100%;
        width: 100%;
        position: relative;

        img {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            height: 50%;
            object-fit: cover;
            border-radius: 0 !important;
        }

        img:nth-child(2) {
            left: 25%;
        }

        img:nth-child(3) {
            left: 50%;
        }
    }
}

.miximage.on_header {
    height: 100%;

    img {
        border-radius: 1.1rem;
    }
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
