<template>
    <form
        id="playlist-update-modal"
        class="m-dialog playlist-modal"
        enctype="multipart/form-data"
        autocomplete="off"
        @submit.prevent="update_playlist"
    >
        <div class="m-body">
            <ImageCrop v-if="cropFile" :file="cropFile" @done="onCropped" @cancel="cropFile = null" />
            <template v-else>
                <section>
                    <label class="m-label" for="modal-playlist-name-input">{{ $t('UpdatePlaylist.Name') }}</label>
                    <input
                        id="modal-playlist-name-input"
                        v-model="pname"
                        class="m-input"
                        type="text"
                        name="name"
                        spellcheck="false"
                        @keypress.enter.prevent="update_playlist"
                    />
                </section>

                <section>
                    <label class="m-label" for="update-pl-image-upload">{{ $t('Common.Image') }}</label>
                    <input
                        id="update-pl-image-upload"
                        ref="dropZoneRef"
                        type="file"
                        accept="image/*"
                        name="image"
                        style="display: none"
                        @change="handleUpload"
                    />
                    <div id="upload" class="boxed">
                        <div class="clickable" tabindex="0" @click="selectFiles" @keydown.space.enter.stop="selectFiles">
                            <ImageIcon />
                            {{ $t('UpdatePlaylist.CoverAction', {action: playlist.has_image ? $t('Common.update') : $t('Common.upload')}) }}
                        </div>
                        <div
                            id="update-pl-img-preview"
                            class="image"
                            :style="{
                                backgroundImage: `url(${playlist.image})`,
                            }"
                            tabindex="0"
                        >
                            <div v-if="!image && playlist.has_image" class="delete-icon" @click="pStore.removeBanner()">
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>
                </section>

                <section v-if="image || playlist.has_image">
                    <label v-if="playlist.has_image && !playlist.settings.square_img" class="m-label">
                        {{ $t('Common.Settings') }}
                    </label>
                    <div class="boxed banner-settings">
                        <div>{{ $t('UpdatePlaylist.SquareCover') }}</div>
                        <Switch :state="playlist.settings.square_img || false" @click="pStore.toggleSquareImage" />
                    </div>
                    <div v-if="playlist.has_image && !playlist.settings.square_img" class="boxed banner-position-adjust">
                        <div class="t-center">{{ $t('UpdatePlaylist.ImagePosition', {pos: pStore.info.settings.banner_pos }) }}</div>
                        <div class="buttons">
                            <button @click.stop.prevent="pStore.minusBannerPos">
                                <ExpandSvg />
                            </button>
                            <button @click.stop.prevent="pStore.plusBannerPos">
                                <ExpandSvg />
                            </button>
                        </div>
                    </div>
                </section>
            </template>
        </div>
        <footer v-if="!cropFile" class="m-footer">
            <button type="button" class="m-btn ghost" @click="emit('hideModal')">{{ $t('ConfirmModal.Cancel') }}</button>
            <button type="submit" class="m-btn primary">
                {{ clicked ? $t('Common.Saving') : $t('Common.Update') }}
            </button>
        </footer>
    </form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Ref, onMounted, ref } from 'vue'

import { updatePlaylist } from '@/requests/playlists'
import usePStore from '@/stores/pages/playlist'

import DeleteIcon from '@/assets/icons/delete.svg'
import ExpandSvg from '@/assets/icons/expand.svg'
import ImageIcon from '@/assets/icons/image.svg'

import ImageCrop from '../shared/ImageCrop.vue'
import Switch from '../SettingsView/Components/Switch.vue'
import { firstImage } from '@/utils/imageFiles'
import { useT } from '@/i18n.js'

const props = defineProps<{
    image?: File | null
}>()

const { t } = useT()
const pStore = usePStore()
const { info: playlist } = storeToRefs(pStore)

const pname = ref(playlist.value.name)
const image: Ref<any> = ref(null)
// an image waiting to be cropped before it becomes the cover; one pasted on the header opens straight in the crop
const cropFile = ref<File | null>(props.image ?? null)

onMounted(() => {
    ;(document.getElementById('modal-playlist-name-input') as HTMLElement | null)?.focus()
})

const emit = defineEmits<{
    (e: 'setTitle', title: string): void
    (e: 'hideModal'): void
}>()

emit('setTitle', t('Modal.UpdatePlaylist'))

function selectFiles() {
    const input = document.getElementById('update-pl-image-upload') as HTMLInputElement
    input.click()
}

function handleUpload() {
    const input = document.getElementById('update-pl-image-upload') as HTMLInputElement

    cropFile.value = firstImage(input.files)
    input.value = ''
}

// A cropped cover is square, so the playlist switches to a square cover.
function onCropped(file: File) {
    cropFile.value = null
    pStore.setImage(URL.createObjectURL(file))
    pStore.setInitialBannerPos()
    if (!playlist.value.settings.square_img) pStore.toggleSquareImage()
    image.value = file
}

let clicked = ref(false)

function update_playlist(e: Event) {
    const form = document.getElementById('playlist-update-modal') as HTMLFormElement
    const formData = new FormData(form)

    const name = formData.get('name') as string

    const nameChanged = name !== playlist.value.name
    const imgChanged = image.value !== undefined

    if (!nameChanged && !imgChanged) {
        emit('hideModal')
        return
    }

    clicked.value = true

    formData.append('image', image.value)
    formData.append('settings', JSON.stringify(pStore.info.settings))

    if (name && name.toString().trim() !== '') {
        updatePlaylist(playlist.value.id, formData, pStore).then(() => {
            emit('hideModal')
        })
    }
}

</script>

<style lang="scss">
.playlist-modal {
    .boxed {
        border: solid 1px $gray5;
        border-radius: 9px;
        color: $gray1;
        place-items: center;
        display: grid;
        grid-template-columns: 1fr max-content;
    }

    .banner-settings {
        font-weight: 500;
        padding: 12px;
        gap: $small;
        justify-items: start;
    }

    #upload {
        width: 100%;
        display: grid;
        gap: $small;
        border: none;

        svg {
            height: 2rem;
        }

        #update-pl-img-preview {
            width: 4.5rem;
            height: 4.5rem;
            border-radius: $small;
            object-fit: cover;
            background-color: $gray4;
            position: relative;
        }

        .clickable {
            font-weight: 500;
            height: 100%;
            width: 100%;
            display: flex;
            gap: $smaller;
            place-items: center;
            place-content: center;
            border-radius: 9px;
            border: dashed 1px $gray5;
            cursor: pointer;
            padding: $medium;

            svg {
                transform: scale(0.75);
                flex-shrink: 0;
            }
        }

        .delete-icon {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.521);
            border-radius: $small;
            transition: all 0.2s ease-out;
            display: flex;
            place-content: center;
            place-items: center;
            cursor: pointer;

            svg {
                transform: scale(1);
                color: rgb(255, 255, 255);
                transition: transform 0.2s ease-out;
            }

            &:hover {
                background-color: $red;

                svg {
                    transform: scale(1.25);
                    transform-origin: center;
                }
            }
        }
    }

    .banner-position-adjust {
        gap: 1rem;
        padding: $small 12px;

        .t-center {
            position: relative;
            font-weight: 500;
            font-variant-numeric: tabular-nums;
        }

        .buttons {
            display: grid;
            gap: $small;

            button {
                aspect-ratio: 1;
                height: 2rem;
                width: 2rem;
                border: none;
                background-color: $gray4;
                padding: 0;

                &:first-child {
                    transform: rotate(-90deg);
                }

                &:last-child {
                    transform: rotate(90deg);
                }

                &:hover {
                    background-color: $blue;
                }
            }
        }
    }
}
</style>
