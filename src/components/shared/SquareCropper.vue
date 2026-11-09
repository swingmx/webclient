<template>
    <div class="square-cropper">
        <div v-if="src" class="stage">
            <img ref="imgEl" :src="src" draggable="false" @load="onLoad" />
            <div
                v-if="natural.width"
                class="crop"
                :style="{
                    left: `${box.x * ratio}px`,
                    top: `${box.y * ratio}px`,
                    width: `${box.side * ratio}px`,
                    height: `${box.side * ratio}px`,
                }"
                @pointerdown="startMove"
            >
                <div class="guide"></div>
                <span
                    v-for="corner in corners"
                    :key="corner"
                    class="handle"
                    :class="corner"
                    @pointerdown.stop="startResize($event, corner)"
                ></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

type Corner = 'nw' | 'ne' | 'sw' | 'se'

const props = defineProps<{
    image: Blob | null
}>()

const OUTPUT_SIZE = 512
const MIN_DISPLAY_SIDE = 64
const corners: Corner[] = ['nw', 'ne', 'sw', 'se']

const imgEl = ref<HTMLImageElement>()
const src = ref('')
const natural = reactive({ width: 0, height: 0 })
// the crop square in image pixels
const box = reactive({ x: 0, y: 0, side: 0 })

const { width: displayWidth } = useElementSize(imgEl)
// display pixels per image pixel
const ratio = computed(() => (natural.width ? displayWidth.value / natural.width : 1))
const minSide = computed(() => Math.min(MIN_DISPLAY_SIDE / (ratio.value || 1), natural.width, natural.height))

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
    stopDrag()
})

function onLoad(e: Event) {
    const img = e.target as HTMLImageElement
    natural.width = img.naturalWidth
    natural.height = img.naturalHeight

    box.side = Math.min(natural.width, natural.height)
    box.x = (natural.width - box.side) / 2
    box.y = (natural.height - box.side) / 2
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Returns the pointer position in image pixels.
 */
function toImage(e: PointerEvent) {
    const rect = imgEl.value!.getBoundingClientRect()
    return { x: (e.clientX - rect.left) / ratio.value, y: (e.clientY - rect.top) / ratio.value }
}

let onDrag: ((e: PointerEvent) => void) | null = null

function beginDrag(e: PointerEvent, handler: (e: PointerEvent) => void) {
    e.preventDefault()
    onDrag = handler
    window.addEventListener('pointermove', handler)
    window.addEventListener('pointerup', stopDrag)
    window.addEventListener('pointercancel', stopDrag)
}

function stopDrag() {
    if (onDrag) window.removeEventListener('pointermove', onDrag)
    window.removeEventListener('pointerup', stopDrag)
    window.removeEventListener('pointercancel', stopDrag)
    onDrag = null
}

function startMove(e: PointerEvent) {
    const start = toImage(e)
    const from = { x: box.x, y: box.y }

    beginDrag(e, ev => {
        const p = toImage(ev)
        box.x = clamp(from.x + p.x - start.x, 0, natural.width - box.side)
        box.y = clamp(from.y + p.y - start.y, 0, natural.height - box.side)
    })
}

/**
 * Resizes the square from `corner`, keeping the opposite corner fixed.
 */
function startResize(e: PointerEvent, corner: Corner) {
    const west = corner.includes('w')
    const north = corner.includes('n')
    const anchor = { x: west ? box.x + box.side : box.x, y: north ? box.y + box.side : box.y }
    const room = Math.min(west ? anchor.x : natural.width - anchor.x, north ? anchor.y : natural.height - anchor.y)

    beginDrag(e, ev => {
        const p = toImage(ev)
        const side = clamp(Math.max(Math.abs(p.x - anchor.x), Math.abs(p.y - anchor.y)), minSide.value, room)

        box.side = side
        box.x = west ? anchor.x - side : anchor.x
        box.y = north ? anchor.y - side : anchor.y
    })
}

/**
 * Returns the cropped square as a png, or null when there is no image.
 */
async function crop(): Promise<Blob | null> {
    if (!imgEl.value || !natural.width) return null

    const out = Math.min(OUTPUT_SIZE, Math.round(box.side))
    const canvas = Object.assign(document.createElement('canvas'), { width: out, height: out })
    canvas.getContext('2d')!.drawImage(imgEl.value, box.x, box.y, box.side, box.side, 0, 0, out, out)

    return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

defineExpose({ crop })
</script>

<style lang="scss">
.square-cropper {
    display: flex;
    justify-content: center;

    .stage {
        position: relative;
        overflow: hidden;
        line-height: 0;
        user-select: none;
        touch-action: none;

        img {
            display: block;
            max-width: 100%;
            max-height: 60vh;
            pointer-events: none;
        }
    }

    .crop {
        position: absolute;
        cursor: move;
        outline: 1px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);

        .guide {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 1px dashed rgba(255, 255, 255, 0.6);
            pointer-events: none;
        }

        .handle {
            position: absolute;
            width: 14px;
            height: 14px;
            background-color: #fff;
            border-radius: 2px;

            // a larger invisible hit area for touch
            &::after {
                content: '';
                position: absolute;
                inset: -10px;
            }

            &.nw {
                top: 0;
                left: 0;
                cursor: nwse-resize;
            }

            &.ne {
                top: 0;
                right: 0;
                cursor: nesw-resize;
            }

            &.sw {
                bottom: 0;
                left: 0;
                cursor: nesw-resize;
            }

            &.se {
                bottom: 0;
                right: 0;
                cursor: nwse-resize;
            }
        }
    }
}
</style>
