<template>
    <div class="crop-view" :style="{ width: `${size}px`, height: `${size}px` }">
        <img :src="crop.url" draggable="false" :style="imageStyle(crop, size)" />
    </div>
</template>

<script lang="ts">
import { Crop, SQUARE, cropSize } from '@/utils/crop'

/**
 * Positions a crop's image inside a square of `size` px.
 */
export function imageStyle(crop: Crop, size: number) {
    const k = size / SQUARE
    const { w, h } = cropSize(crop)

    return {
        width: `${w * k}px`,
        height: `${h * k}px`,
        left: `${size / 2 + crop.x * k - (w * k) / 2}px`,
        top: `${size / 2 + crop.y * k - (h * k) / 2}px`,
    }
}
</script>

<script setup lang="ts">
defineProps<{
    crop: Crop
    size: number
}>()
</script>

<style lang="scss">
.crop-view {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;

    img {
        position: absolute;
        max-width: none;
        user-select: none;
        pointer-events: none;
    }
}
</style>
