<template>
    <div class="work-page-header">
        <div v-if="album" class="work-cover shadow-lg rounded-sm">
            <ImageLoader
                :image="imguri.thumb.large + album.image"
                :blurhash="album.blurhash"
                :duration="1000"
                img-class="rounded-sm"
            />
        </div>
        <div class="work-info">
            <div v-if="work.composer || work.year_composed" class="composer">
                <span v-if="work.composer" class="name">{{ work.composer }}</span>
                <span v-if="work.composer && work.year_composed" class="dot">·</span>
                <span v-if="work.year_composed" class="year">{{ work.year_composed }}</span>
            </div>
            <div class="title">{{ work.name }}</div>
            <div v-if="work.nickname || work.subtitle" class="names">
                <span v-if="work.nickname">“{{ work.nickname }}”</span>
                <span v-if="work.nickname && work.subtitle"> · </span>
                <span v-if="work.subtitle">{{ work.subtitle }}</span>
            </div>
            <div v-if="bubbles.length" class="bubbles">
                <span v-for="bubble in bubbles" :key="bubble" class="bubble">{{ bubble }}</span>
            </div>
            <div v-if="album" class="recording">
                <span>{{ album.albumartists.map(a => a.name).join(', ') }}</span>
                <span class="dot">·</span>
                <RouterLink :to="{ name: Routes.album, params: { albumhash: album.albumhash } }" class="album">
                    {{ album.title }}
                </RouterLink>
                <template v-if="album.date">
                    <span class="dot">·</span>
                    <span>{{ new Date(album.date * 1000).getFullYear() }}</span>
                </template>
            </div>
            <div class="buttons">
                <button
                    v-wave
                    class="workplaybtn shadow-sm circular btn-active"
                    :style="{
                        backgroundColor: palette.colors.btn || '',
                        borderColor: palette.colors.btn || '',
                        color: palette.colors.btn ? getShift(palette.colors.btn, [100, 100]) : '',
                    }"
                    @click="$emit('playWork')"
                >
                    <PlaySvg />
                    <div class="text">{{ $t('Common.Play') }}</div>
                </button>
                <button v-wave class="queuebtn circular" @click="addToQueue">
                    {{ $t('Menus.Common.AddToQueue') }}
                </button>
                <button
                    class="optionsbtn circular"
                    :class="{ context_menu_showing }"
                    @click.prevent="showContextMenu"
                >
                    <MoreSvg />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { paths } from '@/config'
import { useT } from '@/i18n'
import { ClassicalWorkPage } from '@/interfaces'
import { Routes } from '@/router'
import { showWorkContextMenu } from '@/helpers/contextMenuHandler'
import useWorkStore from '@/stores/pages/work'
import useTracklist from '@/stores/queue/tracklist'
import { getShift } from '@/utils/colortools/shift'
import setColorsToStore from '@/utils/colortools/setColorsToStore'
import formatSeconds from '@/utils/useFormatSeconds'
import updatePageTitle from '@/utils/updatePageTitle'

import MoreSvg from '@/assets/icons/more.svg'
import PlaySvg from '@/assets/icons/play.svg'
import ImageLoader from '@/components/shared/ImageLoader.vue'

const props = defineProps<{
    work: ClassicalWorkPage
}>()

defineEmits<{
    (e: 'playWork'): void
}>()

const { t } = useT()
const imguri = paths.images
const palette = reactive({ colors: { btn: '', bg: '' } })

const album = computed(() => props.work.recording.album ?? null)
const context_menu_showing = ref(false)

function showContextMenu(e: MouseEvent) {
    showWorkContextMenu(e, context_menu_showing)
}

function addToQueue() {
    const store = useWorkStore()
    useTracklist().addTracks(store.tracks, store.asWork ? [store.asWork] : undefined)
}

const bubbles = computed(() => {
    const movements = props.work.recording.movements
    const duration = movements.reduce((total, m) => total + (m.duration || 0), 0)

    return [
        ...props.work.catalogue_ids.map(id => id.name),
        t('Views.WorkView.MovementCount', { n: movements.length }, movements.length),
        duration ? formatSeconds(duration, true) : '',
    ].filter(Boolean)
})

function setTitle() {
    updatePageTitle(props.work.composer ? `${props.work.name} - ${props.work.composer}` : props.work.name)
}

function setColors() {
    palette.colors.btn = ''
    if (album.value?.image) {
        setColorsToStore(palette, imguri.thumb.small + album.value.image, true)
    }
}

onMounted(() => {
    setTitle()
    setColors()
})
watch(() => props.work.workhash, setTitle)
watch(() => album.value?.albumhash, setColors)
</script>

<style lang="scss">
.work-page-header {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4rem;
    align-items: center;
    padding: 1rem;

    .work-cover {
        width: 16rem;
        height: 16rem;
        position: relative;
    }

    .work-info {
        display: flex;
        flex-direction: column;
        gap: $small;
        min-width: 0;
    }

    .composer {
        font-size: 14px;
        letter-spacing: 0.08em;
        text-transform: uppercase;

        .name {
            font-weight: 700;
        }

        .dot,
        .year {
            color: $gray1;
        }

        .dot {
            margin: 0 $small;
        }
    }

    .title {
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

    .bubbles {
        display: flex;
        flex-wrap: wrap;
        gap: $small;

        .bubble {
            padding: $smaller 0.75rem;
            border: solid 1px $gray3;
            border-radius: 2rem;
            font-size: 0.9rem;
        }
    }

    .recording {
        font-size: 0.95rem;
        color: $gray1;

        .album {
            color: $white;

            &:hover {
                text-decoration: underline;
            }
        }

        .dot {
            margin: 0 $smaller;
        }
    }

    .buttons {
        display: flex;
        align-items: center;
        gap: $small;
        margin-top: $small;
    }

    .queuebtn {
        padding: 0 1.25rem;
        background-color: transparent;
        border: solid 1px $gray3;
    }

    .optionsbtn {
        width: 2.5rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: solid 1px $gray3;

        &.context_menu_showing {
            background-color: $darkblue;
        }
    }

    .workplaybtn {
        width: 6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white;
        padding-right: 1rem;

        svg {
            height: 1.75rem;
        }
    }

    @include largePhones {
        grid-template-columns: 1fr;

        .work-cover {
            width: 14rem;
            height: 14rem;
            margin: 0 auto;
        }

        .title {
            font-size: 1.5rem;
        }
    }
}
</style>
