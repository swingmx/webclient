<template>
    <div class="headparent">
        <div
            v-if="!on_sidebar"
            class="artist-header-ambient rounded-lg"
            :class="{ isSmallPhone }"
            :style="{
                boxShadow: !useCircularImage ? (colors.bg.length ? `0 .5rem 2rem ${colors.bg}` : undefined) : undefined,
            }"
        ></div>
        <div
            ref="artistheader"
            class="artist-page-header rounded-lg no-scroll"
            :class="{ isSmallPhone, useCircularImage }"
            :style="{
                height: `${isSmallPhone ? '25rem' : containerHeight}`,
            }"
        >
            <Info :artist="artist" :use-circular-image="useCircularImage" />
            <div
                class="artist-img no-select"
                :class="{ editable: canEdit, droptarget: dropping }"
                :style="{
                    height: containerHeight,
                }"
                :tabindex="canEdit ? 0 : undefined"
                @paste="onPaste"
                @dragover="onDragOver"
                @dragleave="dropping = false"
                @drop="onDrop"
            >
                <img
                    id="artist-avatar"
                    :src="paths.images.artist.large + artist.image"
                    :style="blurhashStyle(artist.blurhash)"
                    @load="store.setBgColor"
                />
                <button
                    v-if="canEdit"
                    class="edit-artist-btn"
                    :title="$t('EditArtist.EditArtist')"
                    @click.stop="modal.showEditArtistModal()"
                >
                    <PencilSvg />
                </button>
            </div>
            <div
                v-if="!useCircularImage"
                class="gradient"
                :style="{
                    backgroundImage: colors.bg
                        ? `linear-gradient(${gradientDirection}, transparent ${
                              isSmall ? 60 : gradientTransparentWidth - (width < 700 ? 40 : width < 900 ? 20 : 10)
                          }%,
        ${colors.bg} ${gradientWidth}%,
        ${colors.bg} 100%)`
                        : '',
                }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useSettingsStore from '@/stores/settings'
import { useElementSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

import PencilSvg from '@/assets/icons/pencil.svg'
import { paths } from '@/config'
import useAuthStore from '@/stores/auth'
import useModalStore from '@/stores/modal'
import blurhashStyle from '@/utils/blurhashStyle'
import { firstImage } from '@/utils/imageFiles'
import updatePageTitle from '@/utils/updatePageTitle'

import { isSmall } from '@/stores/content-width'
import useArtistStore from '@/stores/pages/artist'
import Info from './HeaderComponents/Info.vue'

const image_width_px = 450
const store = useArtistStore()
const settings = useSettingsStore()

const props = defineProps<{
    on_sidebar?: boolean
}>()

const { info: artist, colors } = storeToRefs(store)

function updateTitle() {
    props.on_sidebar ? () => {} : updatePageTitle(artist.value.display_name || artist.value.name)
}

const auth = useAuthStore()
const modal = useModalStore()
const canEdit = computed(() => !props.on_sidebar && auth.is_admin)
const dropping = ref(false)

function onPaste(e: ClipboardEvent) {
    const file = firstImage(e.clipboardData?.files)
    if (!canEdit.value || !file) return
    e.preventDefault()
    modal.showEditArtistModal(file)
}

function onDragOver(e: DragEvent) {
    if (!canEdit.value || !e.dataTransfer?.types.includes('Files')) return
    e.preventDefault()
    dropping.value = true
}

function onDrop(e: DragEvent) {
    dropping.value = false
    const file = firstImage(e.dataTransfer?.files)
    if (!canEdit.value || !file) return
    e.preventDefault()
    modal.showEditArtistModal(file)
}

onMounted(() => updateTitle())
watch(() => artist.value.display_name, () => updateTitle())
onBeforeRouteUpdate(() => updateTitle())

const artistheader: Ref<HTMLElement | null> = ref(null)
const { width } = useElementSize(artistheader)

const gradientTransparentWidth = computed(() => Math.floor((image_width_px / (width.value || 1)) * 100))

const isSmallPhone = computed(() => width.value <= 660)
const useCircularImage = computed(() => !isSmallPhone.value && settings.useCircularArtistImg)

const gradientDirection = computed(() => (isSmallPhone.value ? '210deg' : 'to left'))

const gradientWidth = computed(() => {
    return isSmallPhone.value ? '80' : Math.min(gradientTransparentWidth.value, 50)
})

const containerHeight = computed(() => {
    return useCircularImage.value ? '13rem' : '18rem'
})
</script>

<style lang="scss">
.headparent {
    height: 100%;
    width: 100%;
    position: relative;
}

.artist-header-ambient {
    height: 18rem;
    width: 100%;
    position: absolute;
    opacity: 0.25;
}

.artist-page-header {
    display: grid;
    grid-template-columns: 1fr 450px;
    position: relative;

    .artist-img {
        display: flex;
        align-items: flex-end;
        order: 1;
        position: relative;
        outline: none;

        .edit-artist-btn {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            z-index: 2;
            display: grid;
            place-items: center;
            width: 2.25rem;
            height: 2.25rem;
            padding: 0;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.55);
            opacity: 0;
            transition: opacity 0.2s ease;

            svg {
                width: 1.1rem;
                height: 1.1rem;
            }
        }

        &.editable:hover .edit-artist-btn,
        &.editable:focus-visible .edit-artist-btn,
        .edit-artist-btn:focus-visible {
            opacity: 1;
        }

        &.editable:focus-visible img,
        &.droptarget img {
            outline: 2px dashed $white;
            outline-offset: -4px;
        }

        img {
            height: 100%;
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            object-position: 0% 20%;
        }
    }

    &.useCircularImage {
        grid-template-columns: min-content 1fr;

        .artist-img {
            padding: 1rem;
            order: -1;
            z-index: 10;

            img {
                border-radius: 50%;
                height: calc(100% - 0rem);
                width: unset;
                aspect-ratio: 1;
            }
        }
    }

    .gradient {
        position: absolute;
        background-image: linear-gradient(to left, transparent 10%, $gray 50%, $gray 100%);
        height: 100%;
        width: 100%;

        &.isSmallPhone {
            background-image: linear-gradient(210deg, transparent 20%, $gray 80%, $gray 100%);
        }
    }

    &.isSmallPhone {
        display: flex;
        flex-direction: column-reverse;
        position: relative;

        .artist-img {
            position: absolute;
            width: 100%;
            top: 0;
            height: 100% !important;

            img {
                height: 100%;
                width: 100%;
                aspect-ratio: 1;
                object-fit: cover;
                object-position: 0% 20%;
            }
        }
    }
}
</style>
