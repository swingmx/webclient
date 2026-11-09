<template>
    <div class="square-cropper">
        <div
            ref="viewport"
            class="viewport rounded-sm"
            :class="{ dragging }"
            @pointerdown="startDrag"
            @pointermove="drag"
            @pointerup="endDrag"
            @pointercancel="endDrag"
            @wheel.prevent="onWheel"
        >
            <img
                v-if="src"
                :src="src"
                draggable="false"
                :style="{
                    width: `${natural.width * scale}px`,
                    height: `${natural.height * scale}px`,
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                }"
                @load="onLoad"
            />
            <div class="mask"></div>
        </div>
        <input
            :value="zoom"
            class="zoom"
            type="range"
            min="1"
            max="4"
            step="0.01"
            :aria-label="$t('EditArtist.Zoom')"
            :disabled="!src"
            @input="setZoom(Number(($event.target as HTMLInputElement).value))"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

const props = defineProps<{
    image: Blob | null
}>()

const OUTPUT_SIZE = 512

const viewport = ref<HTMLElement>()
const src = ref('')
const natural = reactive({ width: 0, height: 0 })
const offset = reactive({ x: 0, y: 0 })
const zoom = ref(1)
const dragging = ref(false)
let last = { x: 0, y: 0 }

const size = () => viewport.value?.clientWidth || 1

// the scale at which the image's shorter side fills the viewport
const coverScale = computed(() => (natural.width ? size() / Math.min(natural.width, natural.height) : 1))
const scale = computed(() => coverScale.value * zoom.value)

watch(
    () => props.image,
    image => {
        if (src.value) URL.revokeObjectURL(src.value)
        src.value = image ? URL.createObjectURL(image) : ''
        natural.width = 0
        natural.height = 0
    },
    { immediate: true }
)

onBeforeUnmount(() => {
    if (src.value) URL.revokeObjectURL(src.value)
})

function onLoad(e: Event) {
    const img = e.target as HTMLImageElement
    natural.width = img.naturalWidth
    natural.height = img.naturalHeight
    zoom.value = 1
    center()
}

function center() {
    offset.x = (size() - natural.width * scale.value) / 2
    offset.y = (size() - natural.height * scale.value) / 2
}

/**
 * Keeps the image covering the viewport.
 */
function clamp() {
    offset.x = Math.min(0, Math.max(size() - natural.width * scale.value, offset.x))
    offset.y = Math.min(0, Math.max(size() - natural.height * scale.value, offset.y))
}

/**
 * Sets the zoom, keeping the viewport center in place.
 */
function setZoom(next: number) {
    const prev = scale.value
    zoom.value = Math.min(4, Math.max(1, next))

    const half = size() / 2
    offset.x = half - ((half - offset.x) * scale.value) / prev
    offset.y = half - ((half - offset.y) * scale.value) / prev
    clamp()
}

function startDrag(e: PointerEvent) {
    if (!src.value) return
    dragging.value = true
    last = { x: e.clientX, y: e.clientY }
    viewport.value?.setPointerCapture(e.pointerId)
}

function drag(e: PointerEvent) {
    if (!dragging.value) return
    offset.x += e.clientX - last.x
    offset.y += e.clientY - last.y
    last = { x: e.clientX, y: e.clientY }
    clamp()
}

function endDrag() {
    dragging.value = false
}

function onWheel(e: WheelEvent) {
    if (!src.value) return
    setZoom(zoom.value - e.deltaY * 0.002)
}

/**
 * Returns the visible square as a png, or null when there is no image.
 */
async function crop(): Promise<Blob | null> {
    if (!src.value || !natural.width) return null

    const img = new Image()
    img.src = src.value
    await img.decode()

    const side = size() / scale.value
    const out = Math.min(OUTPUT_SIZE, Math.round(side))
    const canvas = Object.assign(document.createElement('canvas'), { width: out, height: out })
    canvas.getContext('2d')!.drawImage(img, -offset.x / scale.value, -offset.y / scale.value, side, side, 0, 0, out, out)

    return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

defineExpose({ crop })
</script>

<style lang="scss">
.square-cropper {
    display: flex;
    flex-direction: column;
    gap: $small;

    .viewport {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        overflow: hidden;
        background-color: $gray5;
        cursor: grab;
        touch-action: none;
        user-select: none;

        &.dragging {
            cursor: grabbing;
        }

        img {
            position: absolute;
            top: 0;
            left: 0;
            max-width: none;
            transform-origin: 0 0;
            pointer-events: none;
        }

        .mask {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: radial-gradient(circle closest-side, transparent 99%, rgba(0, 0, 0, 0.55) 100%);
        }
    }

    .zoom {
        width: 100%;
    }
}
</style>
