<template>
    <RouterLink :to="link" class="top-result-item classical-top-item rounded">
        <PersonImage v-if="isPerson" class="portrait circular" :image="top.image" :name="top.name ?? ''" :tint="top.tint" />
        <div v-else class="tile rounded-sm" :class="{ numeral: isMovement }" :style="composerTint(top.tint)">
            <span>{{ top.mark }}</span>
        </div>

        <div class="info">
            <div v-if="!isPerson && top.composer" class="composer ellip">{{ top.composer }}</div>
            <h3>{{ isMovement ? top.title : top.name }}</h3>
            <div v-if="top.type === 'work' && top.nickname" class="serif">“{{ top.nickname }}”</div>
            <div v-if="isMovement" class="from">
                {{ $t('Search.From') }} <span class="serif">{{ top.work }}</span>
            </div>
            <div v-if="top.type === 'composer' && lifeLine" class="serif">{{ lifeLine }}</div>
            <div class="meta">
                <span class="chip">{{ $t(`Search.${top.type}`) }}</span>
                <span class="ellip">{{ details }}</span>
            </div>
            <div v-if="top.performers" class="performers ellip">{{ top.performers }}</div>
        </div>

        <div class="buttons">
            <button
                v-if="isMovement"
                :class="{ context_menu_showing }"
                class="context-menu-button"
                @click.prevent="showMenu"
            >
                <Moresvg />
            </button>
            <span v-else></span>
            <button v-if="top.type === 'work'" class="play-btn circular" @click.prevent.stop="playWork">
                <PlaySvg />
            </button>
            <PlayBtn
                v-else
                :source="isPerson ? playSources.artist : playSources.track"
                :artisthash="top.artisthash"
                :artistname="top.name"
                :track="top.track"
            />
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { playSources } from '@/enums'
import { showTrackContextMenu } from '@/helpers/contextMenuHandler'
import { useT } from '@/i18n'
import { ClassicalTopResult } from '@/interfaces'
import { getWork } from '@/requests/classical'
import { Routes } from '@/router'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import useSearchStore from '@/stores/search'
import { formatSeconds } from '@/utils'
import composerTint from '@/utils/composerTint'

import Moresvg from '@/assets/icons/more.svg'
import PlaySvg from '@/assets/icons/play.svg'
import PersonImage from '@/components/shared/PersonImage.vue'
import PlayBtn from '@/components/shared/PlayBtn.vue'

const { t } = useT()
const { top_results } = storeToRefs(useSearchStore())

const top = computed(() => top_results.value.top_result as ClassicalTopResult)
const isPerson = computed(() => top.value.type === 'composer' || top.value.type === 'performer')
const isMovement = computed(() => top.value.type === 'movement')

const link = computed(() => {
    if (isPerson.value) return { name: Routes.artist, params: { hash: top.value.artisthash || ' ' } }
    return {
        name: Routes.work,
        params: { token: top.value.workhash || ' ' },
        query: top.value.albumhash ? { albumhash: top.value.albumhash } : {},
    }
})

/**
 * A composer's years and era: "1770 – 1827 · Classical era".
 */
const lifeLine = computed(() => {
    const era = top.value.era ? t('Search.Era', { era: top.value.era }) : null
    return [top.value.years, era].filter(Boolean).join(' · ')
})

const details = computed(() => {
    const it = top.value
    switch (it.type) {
        case 'work':
            return [
                it.movement_count ? t('Views.WorkView.MovementCount', { n: it.movement_count }, it.movement_count) : null,
                it.duration ? t('Views.Listening.ShortMinutes', { m: Math.round(it.duration / 60) }) : null,
                t('Views.ComposerView.Recordings', { n: it.recording_count }, it.recording_count ?? 0),
            ]
                .filter(Boolean)
                .join(' · ')
        case 'movement':
            return [it.catalogue, it.duration ? formatSeconds(it.duration) : null].filter(Boolean).join(' · ')
        default:
            return [
                t('Views.ComposerView.WorkCount', { n: it.work_count }, it.work_count ?? 0),
                t('Common.TrackCount', { count: it.track_count }, it.track_count ?? 0),
                t('Views.ComposerView.AlbumCount', { n: it.album_count }, it.album_count ?? 0),
            ].join(' · ')
    }
})

const context_menu_showing = ref(false)

function showMenu(e: MouseEvent) {
    if (top.value.track) showTrackContextMenu(e, top.value.track, context_menu_showing)
}

/**
 * Play the work's movements on the recording the result points to.
 */
async function playWork() {
    if (!top.value.workhash) return
    const work = await getWork(top.value.workhash, top.value.albumhash ?? undefined)
    if (!work) return
    const tracks = work.recording.movements
    const { recording, other_recordings, ...header } = work
    useTracklist().setFromWork(work.name, work.workhash, recording.albumhash, tracks, [{ ...header, movements: tracks }])
    useQueue().play(0)
}
</script>

<style lang="scss">
.classical-top-item {
    align-items: flex-start;

    .portrait,
    .tile {
        width: 7.5rem;
        height: 7.5rem;
    }

    .portrait {
        object-fit: cover;
    }

    .tile {
        display: flex;
        align-items: flex-end;
        padding: 0.75rem;
        background: var(--tile-bg);
        box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--tile-label) 16%, transparent);
        color: var(--tile-label);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 1.6rem;
        line-height: 1;
        overflow: hidden;

        span {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.05;
        }

        &.numeral {
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        padding-right: 3.5rem;

        h3 {
            margin: 0;
            font-size: 1.5rem;
        }
    }

    .composer {
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: $gray1;
    }

    .serif {
        font-family: Georgia, 'Times New Roman', serif;
        font-style: italic;
        font-size: 1.1rem;
    }

    .from {
        color: $gray1;

        .serif {
            color: $white;
        }
    }

    .meta {
        display: flex;
        align-items: center;
        gap: $small;
        margin-top: 0.75rem;
        font-size: 14px;
        color: $gray1;
        min-width: 0;
    }

    .chip {
        flex-shrink: 0;
        padding: 2px $small;
        border-radius: 2rem;
        background-color: $gray4;
        color: $white;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .performers {
        font-size: 14px;
        color: $gray1;
        margin-top: $smaller;
    }
}
</style>
