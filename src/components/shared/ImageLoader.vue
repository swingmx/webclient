<template>
    <div
        ref="imageLoader"
        class="image-loader"
        :style="{
            height: `${Math.max(imageHeights[images[0]?.key] || 0, containerWidth || 0)}px`,
        }"
    >
        <canvas
            v-if="props.blurhash"
            ref="blurhashCanvas"
            class="blurhash-placeholder rounded-sm"
            :class="{ 'fade-out': imageLoaded }"
            :style="{
                transitionDuration: `${duration}ms`,
                height: `${Math.max(imageHeights[images[0]?.key] || 0, containerWidth || 0)}px`,
            }"
        ></canvas>
        <img
            v-for="(img, index) in images"
            :key="img.key"
            :ref="el => setImageRef(img.key, el)"
            :src="img.src"
            :class="`${index === activeIndex && readyToShowKeys.has(img.key) ? 'active' : ''} il-image ${
                imgClass || ''
            }`"
            :style="{
                transitionDuration: `${duration}ms`,
            }"
            @load="onDomImageLoad(img.key, $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { decode } from 'blurhash'
import { computed, ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps<{
    image: string
    duration: number
    blurhash?: string
    imgClass?: string
}>()

const imageKey = ref(0)
const activeIndex = ref(0)
const imageLoaded = ref(false)
const readyToShowKeys = ref<Set<number>>(new Set())
const imageHeights = ref<Record<number, number>>({})
const imageLoader = ref<HTMLDivElement | null>(null)
const blurhashCanvas = ref<HTMLCanvasElement | null>(null)
const images = ref<Array<{ src: string; key: number }>>([])
const imageRefs = ref<Record<number, HTMLImageElement | null>>({})
const containerWidth = computed(() => imageLoader.value?.clientWidth)

watch(
    () => props.image,
    async newImage => {
        if (!newImage) return
        renderBlurhash()

        imageLoaded.value = false
        readyToShowKeys.value.clear()

        const imageKeyValue = imageKey.value++
        const newImageObj = {
            src: newImage,
            key: imageKeyValue,
        }

        images.value.push(newImageObj)

        if (images.value.length > 2) {
            const removedImage = images.value.shift()
            if (removedImage) {
                delete imageRefs.value[removedImage.key]
                readyToShowKeys.value.delete(removedImage.key)
            }
        }

        setTimeout(() => {
            activeIndex.value = images.value.length - 1
        }, 10)

        await loadImageManually(newImage, imageKeyValue)
    },
    { immediate: true }
)

function renderBlurhash() {
    if (!props.blurhash || !blurhashCanvas.value || !containerWidth.value) return

    const canvas = blurhashCanvas.value
    const width = containerWidth.value
    const height = imageHeights.value[images.value[0]?.key] || width

    canvas.width = width
    canvas.height = height

    try {
        const pixels = decode(props.blurhash, width, height)
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const imageData = ctx.createImageData(width, height)
        imageData.data.set(pixels)
        ctx.putImageData(imageData, 0, 0)
    } catch (error) {
        console.error('Failed to decode blurhash:', error)
    }
}

function setImageRef(key: number, el: unknown) {
    if (el && el instanceof HTMLImageElement) {
        imageRefs.value[key] = el
    } else {
        imageRefs.value[key] = null
    }
}

function onDomImageLoad(imageKeyValue: number, eventOrElement: Event | HTMLImageElement) {
    if (readyToShowKeys.value.has(imageKeyValue)) return

    const imgElement = eventOrElement instanceof Event ? (eventOrElement.target as HTMLImageElement) : eventOrElement

    if (!imgElement || !imageLoader.value) return

    if (imgElement.complete && imgElement.naturalHeight > 0) {
        const minHeight = Math.min(imageLoader.value?.clientWidth || 0, imgElement.naturalHeight)
        imageHeights.value = { ...imageHeights.value, [imageKeyValue]: minHeight }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                readyToShowKeys.value.add(imageKeyValue)
                imageLoaded.value = true
            })
        })
    }
}

async function loadImageManually(imageSrc: string, imageKeyValue: number) {
    try {
        const response = await fetch(imageSrc)
        if (!response.ok) {
            throw new Error(`Failed to load image: ${response.statusText}`)
        }

        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)

        await nextTick()

        const imageIndex = images.value.findIndex(img => img.key === imageKeyValue)
        if (imageIndex !== -1) {
            const imgElement = imageRefs.value[imageKeyValue]
            if (imgElement) {
                if (imgElement.complete && imgElement.naturalHeight > 0) {
                    onDomImageLoad(imageKeyValue, imgElement)
                }
            }
            images.value[imageIndex].src = imageUrl
        }
    } catch (error) {
        console.error('Error loading image:', error)
        await nextTick()
        const imageIndex = images.value.findIndex(img => img.key === imageKeyValue)
        if (imageIndex !== -1) {
            const imgElement = imageRefs.value[imageKeyValue]
            if (imgElement) {
                if (imgElement.complete && imgElement.naturalHeight > 0) {
                    onDomImageLoad(imageKeyValue, imgElement)
                }
            }
            images.value[imageIndex].src = imageSrc
        }
    }
}

watch(
    () => activeIndex.value,
    () => {
        if (images.value.length > 1 && activeIndex.value === images.value.length - 1) {
            setTimeout(() => {
                images.value = images.value.slice(-1)
                activeIndex.value = 0
            }, props.duration)
        }
    }
)

onMounted(() => {
    renderBlurhash()
})
</script>

<style lang="scss">
.image-loader {
    position: relative;
    width: 100%;
    height: 100%;

    .blurhash-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 1;
        transition: opacity ease-in-out;
        z-index: 0;

        &.fade-out {
            opacity: 0;
        }
    }

    .il-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity ease-in-out;
        z-index: 1;

        &.active {
            opacity: 1;
        }
    }
}
</style>
