<template>
    <div class="crop-stage-wrap">
        <div
            class="crop-stage"
            :class="{ dragging }"
            @pointerdown="startDrag"
            @pointermove="drag"
            @pointerup="endDrag"
            @pointercancel="endDrag"
            @wheel.prevent="zoomCrop(crop, crop.zoom - $event.deltaY * 0.002)"
        >
            <div class="square" :style="{ width: `${SQUARE}px`, height: `${SQUARE}px` }">
                <img :src="crop.url" draggable="false" :style="imageStyle(crop, SQUARE)" />
                <div class="frame">
                    <span class="line v1"></span>
                    <span class="line v2"></span>
                    <span class="line h1"></span>
                    <span class="line h2"></span>
                </div>
            </div>
            <div class="pill">{{ $t('EditArtist.DragToReposition') }}</div>
        </div>
        <div class="zoom-row">
            <svg class="zoom-icon small" viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="5" height="5" rx="1" /></svg>
            <input
                class="zoom-slider"
                type="range"
                :min="MIN_ZOOM"
                :max="MAX_ZOOM"
                step="0.01"
                :value="crop.zoom"
                :aria-label="$t('EditArtist.Zoom')"
                @input="zoomCrop(crop, Number(($event.target as HTMLInputElement).value))"
            />
            <svg class="zoom-icon" viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="11" height="11" rx="1.5" /></svg>
            <span class="zoom-value">{{ Math.round(crop.zoom * 100) }}%</span>
            <CropView class="preview" :crop="crop" :size="48" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Crop, MAX_ZOOM, MIN_ZOOM, SQUARE, clampCrop, zoomCrop } from '@/utils/crop'
import CropView, { imageStyle } from './CropView.vue'

const props = defineProps<{
    crop: Crop
}>()

const dragging = ref(false)
let last = { x: 0, y: 0 }

function startDrag(e: PointerEvent) {
    dragging.value = true
    last = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function drag(e: PointerEvent) {
    if (!dragging.value) return
    props.crop.x += e.clientX - last.x
    props.crop.y += e.clientY - last.y
    last = { x: e.clientX, y: e.clientY }
    clampCrop(props.crop)
}

function endDrag() {
    dragging.value = false
}
</script>

<style lang="scss">
.crop-stage-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.crop-stage {
    position: relative;
    width: 100%;
    height: 300px;
    display: grid;
    place-items: center;
    background-color: #0d0d0f;
    border-radius: 10px;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
    user-select: none;

    &.dragging {
        cursor: grabbing;
    }

    .square {
        position: relative;

        img {
            position: absolute;
            max-width: none;
            pointer-events: none;
        }
    }

    .frame {
        position: absolute;
        inset: 0;
        border: 1.5px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 0 0 999px rgba(13, 13, 15, 0.72);
        pointer-events: none;

        .line {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.28);
        }

        .v1,
        .v2 {
            top: 0;
            bottom: 0;
            width: 1px;
        }

        .h1,
        .h2 {
            left: 0;
            right: 0;
            height: 1px;
        }

        .v1 {
            left: 33.333%;
        }

        .v2 {
            left: 66.666%;
        }

        .h1 {
            top: 33.333%;
        }

        .h2 {
            top: 66.666%;
        }
    }

    .pill {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 3px 10px;
        font-size: 11px;
        border-radius: 999px;
        background-color: rgba(0, 0, 0, 0.5);
        color: #ededed;
        pointer-events: none;
        white-space: nowrap;
    }
}

.zoom-row {
    display: flex;
    align-items: center;
    gap: 14px;

    .zoom-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        fill: none;
        stroke: #8a8a91;
        stroke-width: 1.3;
    }

    .zoom-slider {
        flex: 1;
        min-width: 0;
        appearance: none;
        height: 4px;
        border-radius: 2px;
        background-color: #2e2e33;
        cursor: pointer;

        &::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #ededed;
            border: none;
        }

        &::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #ededed;
            border: none;
        }
    }

    .zoom-value {
        width: 3rem;
        text-align: right;
        font-size: 13px;
        color: #8a8a91;
        font-variant-numeric: tabular-nums;
    }

    .preview {
        border-radius: 8px;
        box-shadow: 0 0 0 1px #2e2e33;
    }
}
</style>
