<template>
    <form class="edit-artist-modal" autocomplete="off" @submit.prevent="save" @dragover.prevent @drop.prevent="onDrop">
        <label>{{ $t('EditArtist.Image') }}</label>
        <SquareCropper v-if="image" ref="cropper" :image="image" />
        <div v-else class="placeholder rounded-sm" tabindex="0" @click="fileInput?.click()" @keydown.enter.space.prevent="fileInput?.click()">
            <img v-if="store.info.image" :src="paths.images.artist.large + store.info.image" class="current" />
            <span>{{ $t('EditArtist.ImageHint') }}</span>
        </div>
        <div class="image-actions">
            <button type="button" @click="fileInput?.click()">{{ $t('EditArtist.Choose') }}</button>
            <button type="button" @click="resetImage">{{ $t('EditArtist.ResetImage') }}</button>
        </div>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="onPick" />

        <label for="artist-display-name">{{ $t('EditArtist.DisplayName') }}</label>
        <input
            id="artist-display-name"
            v-model="displayName"
            type="search"
            class="rounded-sm"
            spellcheck="false"
            maxlength="200"
            :placeholder="store.info.name"
        />
        <div class="hint">{{ $t('EditArtist.DisplayNameHint') }}</div>

        <button type="submit" class="save" :disabled="saving">{{ $t('EditArtist.Save') }}</button>
    </form>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { paths } from '@/config'
import { useT } from '@/i18n'
import useArtistStore from '@/stores/pages/artist'
import { firstImage } from '@/utils/imageFiles'

import SquareCropper from '../shared/SquareCropper.vue'

const { t } = useT()
const store = useArtistStore()

const emit = defineEmits<{
    (e: 'setTitle', title: string): void
    (e: 'hideModal'): void
}>()

emit('setTitle', t('EditArtist.Title'))

const fileInput = ref<HTMLInputElement>()
const cropper = ref<InstanceType<typeof SquareCropper>>()
const image = ref<Blob | null>(null)
const displayName = ref(store.info.display_name || '')
const saving = ref(false)

function setImage(file: Blob | null) {
    if (file) image.value = file
}

function onPick(e: Event) {
    const input = e.target as HTMLInputElement
    setImage(firstImage(input.files))
    input.value = ''
}

function onDrop(e: DragEvent) {
    setImage(firstImage(e.dataTransfer?.files))
}

function onPaste(e: ClipboardEvent) {
    const file = firstImage(e.clipboardData?.files)
    if (!file) return
    e.preventDefault()
    setImage(file)
}

onMounted(() => window.addEventListener('paste', onPaste))
onBeforeUnmount(() => window.removeEventListener('paste', onPaste))

async function resetImage() {
    image.value = null
    await store.resetImage()
}

async function save() {
    saving.value = true

    try {
        if (image.value) {
            const cropped = await cropper.value?.crop()
            if (cropped && !(await store.uploadImage(cropped))) return
        }

        const name = displayName.value.trim() || null
        if (name !== (store.info.display_name || null) && !(await store.setDisplayName(name))) return

        emit('hideModal')
    } finally {
        saving.value = false
    }
}
</script>

<style lang="scss">
.edit-artist-modal {
    display: flex;
    flex-direction: column;
    gap: $small;

    label {
        font-size: 0.9rem;
        color: $gray1;
    }

    .placeholder {
        width: 100%;
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        position: relative;
        overflow: hidden;
        background-color: $gray5;
        cursor: pointer;

        .current {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.35;
        }

        span {
            position: relative;
            padding: $medium;
            text-align: center;
        }
    }

    .image-actions {
        display: flex;
        gap: $small;
        justify-content: space-between;
    }

    .hint {
        font-size: 0.8rem;
        color: $gray1;
    }

    .save {
        margin-top: $small;
    }
}
</style>
