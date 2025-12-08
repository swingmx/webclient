<template>
    <div
        ref="imageLoader"
        class="image-loader"
        :style="{ height: imageHeights[images[0].key] ? `${imageHeights[images[0].key]}px` : 'auto' }"
    >
        <img
            v-for="(img, index) in images"
            :key="img.key"
            :src="img.src"
            :class="`${index === activeIndex ? 'active' : ''} il-image ${imgClass || ''}`"
            :style="{
                transitionDuration: `${duration}ms`,
            }"
            @load="onImageLoad(img.key, $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
    image: string
    duration: number
    preloadImage?: string
    imgClass?: string
}>()

const imageLoader = ref<HTMLDivElement | null>(null)
const images = ref<Array<{ src: string; key: number }>>([])
const activeIndex = ref(0)
const imageKey = ref(0)
const preloadedImageUrl = ref<string | null>(null)
const preloadImageElement = ref<HTMLImageElement | null>(null)
const imageHeights = ref<Record<number, number>>({})
const imageNaturalHeights = ref<Record<number, number>>({})
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

function updateContainerWidth() {
    if (imageLoader.value) {
        containerWidth.value = imageLoader.value.clientWidth
        if (containerWidth.value) {
            recalculateHeights(containerWidth.value)
        }
    }
}

function recalculateHeights(width: number) {
    const updated: Record<number, number> = {}
    Object.entries(imageNaturalHeights.value).forEach(([key, naturalHeight]) => {
        updated[Number(key)] = Math.min(width, naturalHeight)
    })
    if (Object.keys(updated).length) {
        imageHeights.value = { ...imageHeights.value, ...updated }
    }
}

onMounted(() => {
    updateContainerWidth()
    if (typeof ResizeObserver !== 'undefined' && imageLoader.value) {
        resizeObserver = new ResizeObserver(updateContainerWidth)
        resizeObserver.observe(imageLoader.value)
    }
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})

watch(
    () => props.preloadImage,
    newPreloadImage => {
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
    newImage => {
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

function onImageLoad(imageKeyValue: number, event: Event) {
    const target = event.target as HTMLImageElement | null
    if (!target || !imageLoader.value) return

    imageNaturalHeights.value = {
        ...imageNaturalHeights.value,
        [imageKeyValue]: target.naturalHeight,
    }

    const minHeight = Math.min(imageLoader.value.clientWidth || 0, target.naturalHeight)
    imageHeights.value = { ...imageHeights.value, [imageKeyValue]: minHeight }

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

    .il-image {
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
