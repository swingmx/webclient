<template>
    <div class="person-header">
        <div
            class="portrait circular shadow-lg"
            :class="{ editable: canEdit, droptarget: dropping }"
            @click="pasteTarget?.focus()"
            @dragover="onDragOver"
            @dragleave="dropping = false"
            @drop="onDrop"
        >
            <img v-if="store.imageOverride" :src="store.imageOverride" alt="" />
            <PersonImage v-else class="circular" size="large" :image="image" :name="page.name" :tint="page.tint" />
            <PasteTarget
                v-if="canEdit"
                ref="pasteTarget"
                :label="$t('EditArtist.PasteTarget')"
                @image="file => modal.showEditArtistModal(file)"
                @enter="modal.showEditArtistModal()"
            />
        </div>
        <div class="info">
            <div class="kicker">
                <span class="kind">{{ page.type === 'composer' ? $t('Views.ComposerView.Composer') : $t('Views.ComposerView.Performer') }}</span>
                <template v-for="part in page.kicker" :key="part">
                    <span class="dot">·</span>
                    <span>{{ part }}</span>
                </template>
            </div>
            <div class="name">{{ page.name }}</div>
            <div v-if="page.nickname || page.years" class="names">
                <span v-if="page.nickname">{{ capitalize(page.nickname) }}</span>
                <span v-if="page.nickname && page.years"> · </span>
                <span v-if="page.years">{{ page.years }}</span>
            </div>
            <div class="chips">
                <span v-for="chip in page.chips" :key="chip" class="chip">{{ chip }}</span>
                <span class="chip">
                    {{ $t('Views.ComposerView.WorksInLibrary', { n: page.work_count }, page.work_count) }}
                </span>
                <span class="chip">
                    {{ $t('Views.ComposerView.AlbumCount', { n: page.album_count }, page.album_count) }}
                </span>
            </div>
            <div class="buttons">
                <button v-wave class="playbtn circular btn-active" @click="$emit('play', false)">
                    <PlaySvg />
                    <div class="text">{{ $t('Views.ComposerView.PlayAll') }}</div>
                </button>
                <button v-wave class="shufflebtn circular" @click="$emit('play', true)">
                    {{ page.type === 'composer' ? $t('Views.ComposerView.ShuffleWorks') : $t('Views.ComposerView.Shuffle') }}
                </button>
                <HeartSvg :state="page.is_favorite ?? false" @handleFav="toggleFavorite" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { favType } from '@/enums'
import favoriteHandler from '@/helpers/favoriteHandler'
import { ClassicalPersonPage } from '@/interfaces'
import useAuthStore from '@/stores/auth'
import useModalStore from '@/stores/modal'
import useArtistStore from '@/stores/pages/artist'
import { firstImage } from '@/utils/imageFiles'
import { computed, ref } from 'vue'

import HeartSvg from '@/components/shared/HeartSvg.vue'
import PasteTarget from '@/components/shared/PasteTarget.vue'
import PersonImage from '@/components/shared/PersonImage.vue'

import PlaySvg from '@/assets/icons/play.svg'

const props = defineProps<{
    page: ClassicalPersonPage
}>()

defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: 'play', shuffle: boolean): void
}>()

const store = useArtistStore()
const modal = useModalStore()
const auth = useAuthStore()
const canEdit = computed(() => auth.is_admin)
const pasteTarget = ref<InstanceType<typeof PasteTarget>>()
const dropping = ref(false)
// a saved edit updates `info`, which holds this person's image from then on
const image = computed(() => (store.info.artisthash === props.page.artisthash ? store.info.image : props.page.image))

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

function toggleFavorite() {
    const store = useArtistStore()
    const person = store.person
    if (!person) return
    favoriteHandler(
        person.is_favorite,
        person.type === 'composer' ? favType.composer : favType.artist,
        person.artisthash,
        () => (person.is_favorite = true),
        () => (person.is_favorite = false)
    )
}

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

</script>

<style lang="scss">
.person-header {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4rem;
    align-items: center;
    padding: 2rem 1rem;

    .portrait {
        width: 14rem;
        height: 14rem;
        background-color: $gray4;
        overflow: hidden;
        position: relative;
        outline: 2px solid transparent;
        outline-offset: 4px;

        // focused, the portrait takes a pasted image
        &.editable:focus-within {
            outline-color: $gray5;
        }

        &.droptarget {
            outline: 2px dashed $gray1;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: $small;
        min-width: 0;
    }

    .kicker {
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: $gray1;

        .kind {
            color: $white;
            font-weight: 700;
        }

        .dot {
            margin: 0 $small;
        }
    }

    .name {
        font-size: 3.75rem;
        font-weight: 700;
        line-height: 1.1;
    }

    .names {
        font-family: Georgia, 'Times New Roman', serif;
        font-style: italic;
        font-size: 1.5rem;
        opacity: 0.9;
    }

    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: $small;

        .chip {
            padding: $smaller 0.75rem;
            border: solid 1px $gray3;
            border-radius: 2rem;
            font-size: 0.85rem;
        }
    }

    .buttons {
        display: flex;
        align-items: center;
        gap: $small;
        margin-top: $small;
    }

    .playbtn {
        display: flex;
        align-items: center;
        gap: $smaller;
        padding: 0 1.25rem 0 0.75rem;
        color: $white;

        svg {
            height: 1.75rem;
        }
    }

    .shufflebtn {
        padding: 0 1.25rem;
        background-color: transparent;
        border: solid 1px $gray3;
    }

    @include largePhones {
        grid-template-columns: 1fr;
        gap: 1.5rem;

        .portrait {
            margin: 0 auto;
        }

        .name {
            font-size: 2rem;
        }
    }
}
</style>
