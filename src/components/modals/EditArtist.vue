<template>
    <div ref="dialog" class="m-dialog edit-artist-dialog" tabindex="-1">
        <div v-if="view === 'edit'" class="m-body">
            <section>
                <div class="m-label">{{ $t('EditArtist.Image') }}</div>
                <div class="ea-image-row">
                    <button class="ea-thumb" :title="$t('EditArtist.Change')" @click="pickFile">
                        <CropView v-if="image.kind === 'new'" :crop="image.crop" :size="112" />
                        <img v-else-if="!creating && !imageFailed" :src="store.imageUrl" @error="imageFailed = true" />
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
                        <div class="ea-help">
                            {{ $t(collective ? 'EditArtist.CollectiveImageHelp' : 'EditArtist.ImageHelp') }}
                        </div>
                        <div class="ea-actions">
                            <button class="m-btn secondary" @click="pickFile">
                                <svg viewBox="0 0 16 16"><path d="M8 11V3M4.5 6.5 8 3l3.5 3.5M3 13h10" /></svg>
                                {{ $t('EditArtist.Upload') }}
                            </button>
                            <button v-if="image.kind === 'new'" class="m-btn secondary" @click="openCrop(image.crop)">
                                <svg viewBox="0 0 16 16"><path d="M4 1.5V12h10.5M1.5 4H12v10.5" /></svg>
                                {{ $t('EditArtist.Crop') }}
                            </button>
                            <button
                                v-if="collective && !creating"
                                class="m-btn secondary"
                                :disabled="useGrid && image.kind === 'current'"
                                @click="resetToGrid"
                            >
                                {{ $t('EditArtist.UseGrid') }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <label class="m-label" for="ea-display-name">
                    {{ $t(collective ? 'EditArtist.Name' : 'EditArtist.DisplayName') }}
                </label>
                <input
                    id="ea-display-name"
                    ref="nameInput"
                    v-model="name"
                    class="m-input"
                    type="text"
                    spellcheck="false"
                    maxlength="200"
                    autocomplete="off"
                    :placeholder="creating ? '' : store.info.name"
                />
                <div v-if="!collective" class="ea-help tertiary">{{ $t('EditArtist.DisplayNameHelp') }}</div>
            </section>

            <section v-if="collective">
                <div class="m-label ea-members-label">
                    {{ $t('EditArtist.Artists') }}
                    <span>{{ $t('EditArtist.ArtistCount', { n: members.length }, members.length) }}</span>
                </div>
                <div class="ea-members">
                    <div v-for="member in members" :key="member.hash" class="ea-member">
                        <PersonImage class="ea-avatar" :image="member.image" :name="member.name" size="small" />
                        <span class="ea-member-name ellip">{{ member.name }}</span>
                        <span v-if="member.trackcount" class="ea-member-count">
                            {{ $t('Common.TrackCount', { count: member.trackcount }, member.trackcount) }}
                        </span>
                        <button
                            class="m-close"
                            :disabled="members.length === 1"
                            :aria-label="$t('EditArtist.RemoveArtist', { artist: member.name })"
                            @click="members = members.filter(m => m.hash !== member.hash)"
                        >
                            <svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            <section v-if="collective">
                <div class="m-label">{{ $t('EditArtist.AddArtists') }}</div>
                <label class="ea-member-search">
                    <svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
                    <input
                        v-model="query"
                        type="text"
                        autocomplete="off"
                        spellcheck="false"
                        :placeholder="$t('EditArtist.AddArtist')"
                        :aria-label="$t('EditArtist.AddArtist')"
                        @keydown.enter.stop.prevent="candidates[0] && addMember(candidates[0])"
                    />
                </label>
                <div class="ea-members ea-results">
                    <div v-if="!candidates.length" class="ea-results-empty">
                        {{ $t(query.trim() ? 'EditArtist.NoArtists' : 'EditArtist.AddArtist') }}
                    </div>
                    <div v-for="artist in candidates" :key="artist.hash" class="ea-member">
                        <PersonImage
                            class="ea-avatar"
                            :image="paletteImage(artist)"
                            :name="artist.name"
                            :blurhash="artist.blurhash"
                            size="small"
                        />
                        <span class="ea-member-name ellip">{{ artist.name }}</span>
                        <button class="m-btn primary ea-add" @click="addMember(artist)">
                            {{ $t('EditArtist.Add') }}
                        </button>
                    </div>
                </div>
            </section>
        </div>

        <div v-else-if="draft" class="m-body crop">
            <CropStage :crop="draft" autofocus />
        </div>

        <footer class="m-footer">
            <template v-if="view === 'edit'">
                <button v-if="collective && !creating" class="m-btn danger" :disabled="saving" @click="deleteCollective">
                    {{ $t(confirmingDelete ? 'EditArtist.ConfirmDelete' : 'EditArtist.DeleteCollective') }}
                </button>
                <button class="m-btn ghost" @click="close">{{ $t('EditArtist.Cancel') }}</button>
                <button class="m-btn primary" :disabled="!dirty" @click="save">
                    {{ $t(creating ? 'EditArtist.Create' : 'EditArtist.Save') }}
                </button>
            </template>
            <template v-else>
                <button class="m-btn ghost" @click="back">{{ $t('EditArtist.Back') }}</button>
                <button class="m-btn primary" @click="applyCrop">{{ $t('EditArtist.ApplyCrop') }}</button>
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
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { useT } from '@/i18n'
import { ArtistEditData } from '@/requests/artists'
import { Routes } from '@/router'
import useCommandPalette, { PaletteArtist } from '@/stores/commandPalette'
import useModalStore from '@/stores/modal'
import useArtistStore, { ArtistEdits } from '@/stores/pages/artist'
import { Crop, loadCrop, renderCrop } from '@/utils/crop'
import { firstImage } from '@/utils/imageFiles'

import CropStage from '../shared/CropStage.vue'
import CropView from '../shared/CropView.vue'
import PersonImage from '../shared/PersonImage.vue'

type ImageState = { kind: 'current' } | { kind: 'new'; crop: Crop }

const props = defineProps<{
    image?: File | null
    // the first artist of a collective to create; nothing is saved until the form is
    firstMember?: { hash: string; name: string }
}>()

const emit = defineEmits<{
    (e: 'hideModal'): void
}>()

const { t } = useT()
const store = useArtistStore()
const modal = useModalStore()

const dialog = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const nameInput = ref<HTMLInputElement>()

const router = useRouter()
const palette = useCommandPalette()

// a collective edits its own name and members; an artist only its display name
const creating = computed(() => !!props.firstMember)
const collective = computed(() => creating.value || !!store.info.members)
const title = computed(() =>
    creating.value ? 'EditArtist.NewCollectiveTitle' : collective.value ? 'EditArtist.CollectiveTitle' : 'EditArtist.Title'
)

const savedName = () => {
    if (creating.value) return ''
    return collective.value ? store.info.name : store.info.display_name || ''
}

interface Member {
    hash: string
    name: string
    image: string
    trackcount?: number
}

const savedMembers = (): Member[] =>
    props.firstMember
        ? [{ ...props.firstMember, image: `${props.firstMember.hash}.webp` }]
        : (store.info.members ?? []).map(m => ({ hash: m.artisthash, name: m.name, image: m.image, trackcount: m.trackcount }))

const members = ref<Member[]>(savedMembers())
const query = ref('')
const useGrid = ref(false)
const confirmingDelete = ref(false)

const paletteImage = (artist: PaletteArtist) => `${artist.hash}.webp${artist.image ? `?${artist.image}` : ''}`

// the command palette's artists, without collectives and current members
const candidates = computed(() => {
    if (!query.value.trim()) return []
    const taken = new Set(members.value.map(m => m.hash))

    return palette.results
        .filter((r): r is PaletteArtist => r.type === 'artist' && !r.members && !taken.has(r.hash))
        .slice(0, 20)
})

watch(query, q => palette.search(q))

function addMember(artist: PaletteArtist) {
    members.value = [...members.value, { hash: artist.hash, name: artist.name, image: paletteImage(artist) }]
}

const membersDirty = computed(
    () => creating.value || members.value.map(m => m.hash).join() !== savedMembers().map(m => m.hash).join()
)

const image = ref<ImageState>({ kind: 'current' })
const name = ref(savedName())
const view = ref<'edit' | 'crop'>('edit')
// the crop being edited in the crop view
const draft = ref<Crop | null>(null)
const saving = ref(false)
const dragging = ref(false)
let dragDepth = 0

const imageFailed = ref(false)
const initial = computed(() => ((creating.value ? name.value : store.info.name) || '?').trim().charAt(0).toUpperCase())
const imageTitle = computed(() => {
    if (image.value.kind === 'new') return t('EditArtist.NewImage')
    return t(creating.value ? 'EditArtist.GridImage' : 'EditArtist.CurrentImage')
})

watchEffect(() => {
    if (view.value === 'crop') return modal.setTitle(t('EditArtist.CropTitle'), t('EditArtist.CropSubtitle'))
    modal.setTitle(t(title.value), creating.value ? '' : store.info.name)
})

const nameDirty = computed(() => name.value.trim() !== savedName())
const dirty = computed(() => {
    if (collective.value && !name.value.trim()) return false
    return image.value.kind === 'new' || nameDirty.value || membersDirty.value || useGrid.value
})

function resetToGrid() {
    setImage({ kind: 'current' })
    useGrid.value = true
}

// a new collective's hash: 16 hex characters, like an artist's
const randomHash = () =>
    Array.from(crypto.getRandomValues(new Uint8Array(8)), b => b.toString(16).padStart(2, '0')).join('')

/**
 * Deletes the collective on the second click and leaves its page.
 */
async function deleteCollective() {
    if (!confirmingDelete.value) {
        confirmingDelete.value = true
        return
    }

    saving.value = true
    const deleted = await store.saveCollective(store.info.artisthash, { members: [] })
    saving.value = false

    if (deleted) {
        close()
        router.replace({ name: Routes.ArtistList })
    }
}

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
    e.preventDefault()
    if (!e.dataTransfer?.types.includes('Files')) return
    dragDepth++
    dragging.value = true
}

function onDragLeave() {
    dragDepth = Math.max(0, dragDepth - 1)
    if (dragDepth === 0) dragging.value = false
}

function onDrop(e: DragEvent) {
    e.preventDefault()
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

// the whole frame takes drops, the shell's header included
const dragEvents = {
    dragenter: onDragEnter,
    dragover: (e: DragEvent) => e.preventDefault(),
    dragleave: onDragLeave,
    drop: onDrop,
}
const dragNames = ['dragenter', 'dragover', 'dragleave', 'drop'] as const
let frame: HTMLElement | null = null

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
        if (collective.value) {
            const data: ArtistEditData = {}
            if (nameDirty.value) data.display_name = name.value.trim()
            if (membersDirty.value) data.members = members.value.map(m => m.hash)
            if (useGrid.value && image.value.kind === 'current') data.use_grid = true

            const blob = image.value.kind === 'new' ? await renderCrop(image.value.crop) : undefined
            const hash = creating.value ? randomHash() : store.info.artisthash
            const saved = await store.saveCollective(hash, data, blob)

            if (!saved) {
                saving.value = false
                return
            }

            close()
            if (creating.value) router.push({ name: Routes.artist, params: { hash } })
            return
        }

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
    frame = dialog.value!.parentElement
    dragNames.forEach(name => frame?.addEventListener(name, dragEvents[name]))
    creating.value ? nameInput.value?.focus() : dialog.value?.focus()
    useFile(props.image ?? null)
})

onBeforeUnmount(() => {
    window.removeEventListener('paste', onPaste)
    window.removeEventListener('keydown', onKeydown, true)
    dragNames.forEach(name => frame?.removeEventListener(name, dragEvents[name]))
    if (draft.value) URL.revokeObjectURL(draft.value.url)
    if (image.value.kind === 'new') URL.revokeObjectURL(image.value.crop.url)
})
</script>

<style lang="scss">
.edit-artist-dialog {
    outline: none;

    svg {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .m-body.crop {
        padding: 16px 24px 22px;
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
        background: linear-gradient(135deg, $gray4, $gray);
        font-size: 40px;
        font-weight: 700;
        color: $gray2;
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
        color: $white;
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
        color: $orange;
        border: 1px solid rgba($orange, 0.3);
        border-radius: 5px;
    }

    .ea-help {
        font-size: 12px;
        line-height: 1.45;
        color: $gray1;

        &.tertiary {
            color: $gray2;
        }
    }

    .ea-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .ea-members-label {
        display: flex;
        justify-content: space-between;

        span {
            font-weight: 400;
            color: $gray1;
        }
    }

    // members scroll past 4.5 rows, search results past 3.5; a row is 49px
    .ea-members {
        max-height: 221px;
        overflow-y: auto;
        // a visible scrollbar narrows the rows only when the list overflows
        @include hideScrollbars;
        border: 1px solid $gray5;
        border-radius: 9px;

        &.ea-results {
            height: 172px;
        }
    }

    .ea-member,
    .ea-member-search {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        height: auto;
        padding: 8px 10px 8px 12px;
        border-bottom: 1px solid $gray5;
        background: transparent;
        color: inherit;
        font-size: 14px;

        &:last-child {
            border-bottom: none;
        }
    }

    .ea-results-empty {
        height: 100%;
        display: grid;
        place-items: center;
        font-size: 13px;
        color: $gray2;
    }

    .m-btn.ea-add {
        padding: 5px 12px;
    }

    .ea-avatar {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        border-radius: 50%;
        object-fit: cover;
        font-size: 12px;
    }

    .ea-member-name {
        flex: 1;
        min-width: 0;
        font-weight: 600;
        text-align: left;
    }

    .ea-member-count {
        font-size: 12px;
        color: $gray1;
    }

    .ea-member-search {
        border: 1px solid $gray5 !important;
        border-radius: 9px;
        color: $gray1;

        svg {
            width: 16px;
            height: 16px;
            margin: 0 8px;
            flex-shrink: 0;
        }

        input {
            flex: 1;
            min-width: 0;
            padding: 6px 0;
            border: none;
            outline: none;
            background: transparent;
            color: $white;
            font-size: 14px;
        }
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
        border: 2px dashed $gray1;
        border-radius: 12px;
        background-color: rgba($black, 0.94);
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
        color: $gray1;
    }
}
</style>
