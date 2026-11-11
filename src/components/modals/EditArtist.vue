<template>
    <div
        ref="dialog"
        class="edit-artist-dialog"
        tabindex="-1"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
    >
        <header class="ea-header">
            <div>
                <div class="ea-title">{{ view === 'crop' ? $t('EditArtist.CropTitle') : $t('EditArtist.Title') }}</div>
                <div class="ea-subtitle">{{ view === 'crop' ? $t('EditArtist.CropSubtitle') : store.info.name }}</div>
            </div>
            <button class="ea-close" :aria-label="$t('EditArtist.Cancel')" @click="close">
                <svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
        </header>

        <div v-if="view === 'edit'" class="ea-body">
            <section>
                <div class="ea-label">{{ $t('EditArtist.Image') }}</div>
                <div class="ea-image-row">
                    <button class="ea-thumb" :title="$t('EditArtist.Change')" @click="pickFile">
                        <CropView v-if="image.kind === 'new'" :crop="image.crop" :size="112" />
                        <img v-else-if="!imageFailed" :src="store.imageUrl" @error="imageFailed = true" />
                        <div v-else class="ea-placeholder">{{ initial }}</div>
                        <div class="ea-thumb-hover">
                            <svg viewBox="0 0 24 24">
                                <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
                                <circle cx="12" cy="13" r="3.5" />
                            </svg>
                            <span>{{ $t('EditArtist.Change') }}</span>
                        </div>
                    </button>
                    <div class="ea-image-info">
                        <div class="ea-image-title">
                            {{ imageTitle }}
                            <span v-if="image.kind === 'new'" class="ea-unsaved">{{ $t('EditArtist.Unsaved') }}</span>
                        </div>
                        <div class="ea-help">{{ $t('EditArtist.ImageHelp') }}</div>
                        <div class="ea-actions">
                            <button class="ea-btn secondary" @click="pickFile">
                                <svg viewBox="0 0 16 16"><path d="M8 11V3M4.5 6.5 8 3l3.5 3.5M3 13h10" /></svg>
                                {{ $t('EditArtist.Upload') }}
                            </button>
                            <button v-if="image.kind === 'new'" class="ea-btn secondary" @click="openCrop(image.crop)">
                                <svg viewBox="0 0 16 16"><path d="M4 1.5V12h10.5M1.5 4H12v10.5" /></svg>
                                {{ $t('EditArtist.Crop') }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <label class="ea-label" for="ea-display-name">{{ $t('EditArtist.DisplayName') }}</label>
                <input
                    id="ea-display-name"
                    v-model="name"
                    class="ea-input"
                    type="text"
                    spellcheck="false"
                    maxlength="200"
                    autocomplete="off"
                    :placeholder="store.info.name"
                />
                <div class="ea-help tertiary">{{ $t('EditArtist.DisplayNameHelp') }}</div>
            </section>
        </div>

        <div v-else-if="draft" class="ea-body crop">
            <CropStage :crop="draft" autofocus />
        </div>

        <footer class="ea-footer">
            <template v-if="view === 'edit'">
                <button class="ea-btn ghost" @click="close">{{ $t('EditArtist.Cancel') }}</button>
                <button class="ea-btn primary" :disabled="!dirty" @click="save">
                    {{ $t('EditArtist.Save') }}
                </button>
            </template>
            <template v-else>
                <button class="ea-btn ghost" @click="back">{{ $t('EditArtist.Back') }}</button>
                <button class="ea-btn primary" @click="applyCrop">{{ $t('EditArtist.ApplyCrop') }}</button>
            </template>
        </footer>

        <div v-if="dragging" class="ea-drop">
            <svg viewBox="0 0 24 24"><path d="M12 4v13M6.5 11.5 12 17l5.5-5.5M5 20h14" /></svg>
            <div class="ea-drop-title">{{ $t('EditArtist.DropTitle') }}</div>
            <div class="ea-drop-sub">{{ $t('EditArtist.DropSubtitle') }}</div>
        </div>

        <input ref="fileInput" type="file" accept="image/*" hidden @change="onPick" />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useT } from '@/i18n'
import useArtistStore, { ArtistEdits } from '@/stores/pages/artist'
import { Crop, loadCrop, renderCrop } from '@/utils/crop'
import { firstImage } from '@/utils/imageFiles'

import CropStage from '../shared/CropStage.vue'
import CropView from '../shared/CropView.vue'

type ImageState = { kind: 'current' } | { kind: 'new'; crop: Crop }

const props = defineProps<{
    image?: File | null
}>()

const emit = defineEmits<{
    (e: 'hideModal'): void
}>()

const { t } = useT()
const store = useArtistStore()

const dialog = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const savedName = () => store.info.display_name || ''

const image = ref<ImageState>({ kind: 'current' })
const name = ref(savedName())
const view = ref<'edit' | 'crop'>('edit')
// the crop being edited in the crop view
const draft = ref<Crop | null>(null)
const saving = ref(false)
const dragging = ref(false)
let dragDepth = 0

const imageFailed = ref(false)
const initial = computed(() => (store.info.name || '?').trim().charAt(0).toUpperCase())
const imageTitle = computed(() => t(image.value.kind === 'new' ? 'EditArtist.NewImage' : 'EditArtist.CurrentImage'))

const nameDirty = computed(() => name.value.trim() !== savedName())
const dirty = computed(() => image.value.kind === 'new' || nameDirty.value)

// object urls still referenced by `image` or `draft`
function revokeUnused(url?: string) {
    if (!url) return
    const used = [draft.value?.url, image.value.kind === 'new' ? image.value.crop.url : undefined]
    if (!used.includes(url)) URL.revokeObjectURL(url)
}

function setImage(next: ImageState) {
    const old = image.value.kind === 'new' ? image.value.crop.url : undefined
    image.value = next
    revokeUnused(old)
}

async function useFile(file: File | null) {
    if (!file) return

    try {
        openCrop(await loadCrop(file))
    } catch {
        // not a decodable image
    }
}

function openCrop(crop: Crop) {
    draft.value = { ...crop }
    view.value = 'crop'
}

function back() {
    const url = draft.value?.url
    draft.value = null
    view.value = 'edit'
    revokeUnused(url)
    dialog.value?.focus()
}

function applyCrop() {
    if (!draft.value) return
    const crop = draft.value
    draft.value = null
    setImage({ kind: 'new', crop })
    view.value = 'edit'
    dialog.value?.focus()
}

function pickFile() {
    fileInput.value?.click()
}

function onPick(e: Event) {
    const input = e.target as HTMLInputElement
    useFile(firstImage(input.files))
    input.value = ''
}

function onPaste(e: ClipboardEvent) {
    const file = firstImage(e.clipboardData?.files)
    if (!file) return
    e.preventDefault()
    useFile(file)
}

function onDragEnter(e: DragEvent) {
    if (!e.dataTransfer?.types.includes('Files')) return
    dragDepth++
    dragging.value = true
}

function onDragLeave() {
    dragDepth = Math.max(0, dragDepth - 1)
    if (dragDepth === 0) dragging.value = false
}

function onDrop(e: DragEvent) {
    dragDepth = 0
    dragging.value = false
    useFile(firstImage(e.dataTransfer?.files))
}

/**
 * Enter runs the visible view's main action; Esc goes back from the crop view or closes.
 */
function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        view.value === 'crop' ? back() : close()
        return
    }

    if (e.key !== 'Enter' || e.repeat || e.isComposing) return
    if ((e.target as HTMLElement)?.closest('button')) return

    e.preventDefault()
    e.stopPropagation()
    view.value === 'crop' ? applyCrop() : save()
}

function close() {
    emit('hideModal')
}

/**
 * Hands the edits to the store, which shows them right away and saves them, then closes.
 */
async function save() {
    if (!dirty.value || saving.value) return
    saving.value = true

    try {
        const edits: ArtistEdits = { artisthash: store.info.artisthash }

        if (image.value.kind === 'new') edits.image = await renderCrop(image.value.crop)

        if (nameDirty.value) edits.name = name.value.trim() || null

        store.applyEdits(edits)
        close()
    } catch {
        saving.value = false
    }
}

onMounted(() => {
    window.addEventListener('paste', onPaste)
    // capture runs before the app's global shortcuts, which close any modal on Esc
    window.addEventListener('keydown', onKeydown, true)
    dialog.value?.focus()
    useFile(props.image ?? null)
})

onBeforeUnmount(() => {
    window.removeEventListener('paste', onPaste)
    window.removeEventListener('keydown', onKeydown, true)
    if (draft.value) URL.revokeObjectURL(draft.value.url)
    if (image.value.kind === 'new') URL.revokeObjectURL(image.value.crop.url)
})
</script>

<style lang="scss">
.edit-artist-dialog {
    position: relative;
    width: 100%;
    background-color: #18181b;
    border: 1px solid #2a2a2f;
    border-radius: 16px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
    color: #ededed;
    outline: none;
    text-align: left;

    svg {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .ea-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px 20px 4px 24px;
    }

    .ea-title {
        font-size: 18px;
        font-weight: 700;
    }

    .ea-subtitle {
        margin-top: 2px;
        font-size: 13px;
        color: #8a8a91;
    }

    .ea-close {
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 8px;
        background: transparent;
        color: #8a8a91;

        &:hover {
            background-color: #26262b;
            color: #ededed;
        }

        svg {
            width: 16px;
            height: 16px;
        }
    }

    .ea-body {
        display: flex;
        flex-direction: column;
        gap: 22px;
        padding: 18px 24px 24px;

        &.crop {
            padding: 16px 24px 22px;
        }

        section {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }

    .ea-label {
        font-size: 13px;
        font-weight: 600;
        color: #d6d6db;
    }

    .ea-image-row {
        display: flex;
        gap: 18px;
        align-items: flex-start;
    }

    .ea-thumb {
        position: relative;
        display: block;
        width: 112px;
        height: 112px;
        flex-shrink: 0;
        padding: 0;
        border-radius: 12px;
        overflow: hidden;
        background: transparent;
        cursor: pointer;

        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &:hover .ea-thumb-hover,
        &:focus-visible .ea-thumb-hover {
            opacity: 1;
        }
    }

    .ea-placeholder {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #3a3a42, #1e1e23);
        font-size: 40px;
        font-weight: 700;
        color: #6b6b72;
    }

    .ea-thumb-hover {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        background-color: rgba(0, 0, 0, 0.55);
        color: #ededed;
        font-size: 12px;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.15s ease;

        svg {
            width: 22px;
            height: 22px;
        }
    }

    .ea-image-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 0;
    }

    .ea-image-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
    }

    .ea-unsaved {
        padding: 1px 6px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #e8a54a;
        border: 1px solid #4a3a22;
        border-radius: 5px;
    }

    .ea-help {
        font-size: 12px;
        line-height: 1.45;
        color: #8a8a91;

        &.tertiary {
            color: #6b6b72;
        }
    }

    .ea-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .ea-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: auto;
        padding: 8px 14px;
        border-radius: 8px;
        // overrides the global button font size
        font-size: 13px !important;
        font-weight: 600;
        border: none;
        cursor: pointer;

        svg {
            width: 14px;
            height: 14px;
        }

        &.secondary {
            background-color: #26262b;
            color: #ededed;

            &:hover {
                background-color: #303036;
            }
        }

        &.ghost {
            background-color: transparent;
            color: #a1a1a8;

            &:hover {
                background-color: #222226;
                color: #ededed;
            }
        }

        &.primary {
            background-color: #ededed;
            color: #0b0b0c;

            &:hover {
                background-color: #fff;
            }

            &:disabled {
                opacity: 1;
                background-color: #2a2a2e;
                color: #5f5f66;
                cursor: default;
            }
        }
    }

    .ea-input {
        width: 100%;
        padding: 11px 12px;
        font-size: 15px;
        color: #ededed;
        background-color: #141416;
        border: 1px solid #2e2e33;
        border-radius: 9px;
        outline: none;

        &::placeholder {
            color: #5f5f66;
        }

        &:focus {
            border-color: #5a5a62;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06);
        }
    }

    .ea-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding: 14px 20px;
        border-top: 1px solid #222226;
    }

    .ea-drop {
        position: absolute;
        inset: 6px;
        z-index: 5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border: 2px dashed #8a8a91;
        border-radius: 12px;
        background-color: rgba(24, 24, 27, 0.94);
        pointer-events: none;

        svg {
            width: 28px;
            height: 28px;
            margin-bottom: 4px;
        }
    }

    .ea-drop-title {
        font-size: 15px;
        font-weight: 600;
    }

    .ea-drop-sub {
        font-size: 12px;
        color: #8a8a91;
    }
}
</style>
