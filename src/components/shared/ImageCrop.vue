<template>
    <div class="image-crop">
        <CropStage v-if="draft" :crop="draft" autofocus />
        <div class="image-crop-actions">
            <button type="button" class="secondary" @click="emit('cancel')">{{ $t('EditArtist.Back') }}</button>
            <button type="button" class="primary" @click="apply">{{ $t('EditArtist.ApplyCrop') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { Crop, loadCrop, renderCrop } from '@/utils/crop'

import CropStage from './CropStage.vue'

const props = defineProps<{
    file: File
}>()

const emit = defineEmits<{
    (e: 'done', file: File): void
    (e: 'cancel'): void
}>()

const draft = ref<Crop | null>(null)

async function apply() {
    if (!draft.value) return
    const blob = await renderCrop(draft.value)
    emit('done', new File([blob], 'image.png', { type: 'image/png' }))
}

/**
 * Enter applies and Esc goes back, before the app's global shortcuts close the modal on Esc.
 */
function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        emit('cancel')
    } else if (e.key === 'Enter' && !e.repeat && !(e.target as HTMLElement)?.closest('button')) {
        e.preventDefault()
        e.stopPropagation()
        apply()
    }
}

onMounted(async () => {
    window.addEventListener('keydown', onKeydown, true)
    try {
        draft.value = await loadCrop(props.file)
    } catch {
        emit('cancel')
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown, true)
    if (draft.value) URL.revokeObjectURL(draft.value.url)
})
</script>

<style lang="scss">
// The hosts style every input and button; the crop step looks the same in all of them.
.image-crop {
    display: grid;
    gap: 1rem;

    .image-crop-actions {
        display: flex;
        justify-content: flex-end;
        gap: $small;

        button {
            height: 2.25rem;
            width: auto;
            margin: 0;
            padding: 0 1rem;
            border-radius: 0.5rem;
            font-size: 0.9rem;
            font-weight: 500;
            opacity: 1;
        }

        .secondary {
            background-color: $gray4;
            color: $white;
        }

        .primary {
            background-color: $white;
            color: $black;
        }
    }
}
</style>
