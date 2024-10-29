<template>
    <div class="miximage" :class="{ on_header }">
        <div
            class="infooverlay"
            :style="{
                color: getTextColor(mix.extra.image?.color || ''),
            }"
        >
            <div class="type" :style="{ color: getTypeColor(mix.extra.image?.color || '') }">
                {{ mix.extra['type'] }} mix
            </div>
            <div class="title ellip">{{ mix.title.replace('Radio', '') }}</div>
        </div>
        <img :src="getImageUrl(mix.extra['image']?.image || '')" />
        <div
            class="gradient rounded-sm"
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

const gradient = ref('')

async function getGradient() {
    const color = props.mix.extra.image?.color

    if (!color) return ''

    return `linear-gradient(27deg, ${color} 21%, ${addOpacity(
        color,
        0.15
    )}),linear-gradient(-17deg, ${color} 10%, ${addOpacity(color, 0)} 30%)`
}

function getImageUrl(image: string) {
    const is_custom = image.endsWith('.jpg')

    if (props.on_header) {
        return (is_custom ? paths.images.mix.medium : paths.images.artist.medium) + image
    }

    return (is_custom ? paths.images.mix.small : paths.images.artist.small) + image
}

const props = defineProps<{
    mix: Mix
    on_header?: boolean
}>()

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
            font-size: 1.25rem;
            font-weight: 900;
        }
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.59rem;
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
