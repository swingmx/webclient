<template>
    <div class="image-loader">
        <img
            v-for="(img, index) in images"
            :key="img.key"
            :src="img.src"
            :class="{ active: index === activeIndex }"
            :style="{ transitionDuration: `${duration}ms` }"
            class="image"
            @load="onImageLoad"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    image: string
    duration: number
    preloadImage?: string
}>()

const images = ref<Array<{ src: string; key: number }>>([])
const activeIndex = ref(0)
const imageKey = ref(0)
const preloadedImageUrl = ref<string | null>(null)
const preloadImageElement = ref<HTMLImageElement | null>(null)

watch(
    () => props.preloadImage,
    (newPreloadImage) => {
        if (!newPreloadImage) {
            preloadedImageUrl.value = null
            preloadImageElement.value = null
            return
        }

        if (preloadedImageUrl.value === newPreloadImage) {
            return
        }

        preloadedImageUrl.value = newPreloadImage
        const img = new Image()
        img.src = newPreloadImage
        preloadImageElement.value = img
    }
)

watch(
    () => props.image,
    (newImage) => {
        if (!newImage) return

        if (preloadedImageUrl.value === newImage && preloadImageElement.value?.complete) {
            preloadedImageUrl.value = null
            preloadImageElement.value = null
        } else if (preloadedImageUrl.value !== newImage) {
            preloadedImageUrl.value = null
            preloadImageElement.value = null
        }

        const newImageObj = {
            src: newImage,
            key: imageKey.value++,
        }

        images.value.push(newImageObj)

        if (images.value.length > 2) {
            images.value.shift()
        }

        setTimeout(() => {
            activeIndex.value = images.value.length - 1
        }, 10)
    },
    { immediate: true }
)

function onImageLoad() {
    if (images.value.length > 1 && activeIndex.value === images.value.length - 1) {
        setTimeout(() => {
            images.value = images.value.slice(-1)
            activeIndex.value = 0
        }, props.duration)
    }
}
</script>

<style lang="scss">
.image-loader {
    position: relative;
    width: 100%;
    height: 100%;

    .image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity ease-in-out;

        &.active {
            opacity: 1;
        }
    }
}
</style>

