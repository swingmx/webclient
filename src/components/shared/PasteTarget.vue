<template>
    <!-- an editable target, since browsers only fire paste where text can be typed -->
    <textarea
        ref="el"
        class="paste-target"
        inputmode="none"
        :aria-label="label"
        @paste="onPaste"
        @input="clear"
        @keydown.enter.prevent="emit('enter')"
    ></textarea>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { firstImage } from '@/utils/imageFiles'

defineProps<{
    label: string
}>()

const emit = defineEmits<{
    (e: 'image', file: File): void
    (e: 'enter'): void
}>()

const el = ref<HTMLTextAreaElement>()

function clear() {
    if (el.value) el.value.value = ''
}

function onPaste(e: ClipboardEvent) {
    const file = firstImage(e.clipboardData?.files)
    if (!file) return
    e.preventDefault()
    emit('image', file)
}

// without preventScroll, Firefox scrolls an overflow-hidden parent to the target and the image jumps
defineExpose({ focus: () => el.value?.focus({ preventScroll: true }) })
</script>

<style lang="scss">
.paste-target {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    padding: 0;
    border: 0;
    opacity: 0;
    resize: none;
    overflow: hidden;
    pointer-events: none;
}
</style>
