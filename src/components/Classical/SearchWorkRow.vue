<template>
    <component
        :is="work ? RouterLink : 'div'"
        v-bind="work ? { to: link } : {}"
        class="search-work-row rounded-sm"
        :class="{ current: isCurrent, menu: menuOn, indexed }"
        @click="!work && $emit('playThis')"
        @contextmenu.prevent="showMenu"
    >
        <TrackIndex
            v-if="indexed"
            :index="index!"
            :is_fav="is_fav"
            :show-inline-fav-icon="settings.showInlineFavIcon"
            @click.stop
            @add-to-fav="toggleFav"
        />
        <img v-if="track" class="thumb" :src="paths.images.thumb.small + track.image" />
        <div v-else class="tile" :style="composerTint(row.tint)">
            <span>{{ row.mark }}</span>
        </div>
        <div class="text">
            <div class="composer ellip">{{ row.composer }}</div>
            <div class="title ellip">
                {{ row.title }}<span v-if="row.nickname" class="nickname"> “{{ row.nickname }}”</span>
            </div>
            <div class="sub ellip">{{ row.sub }}</div>
        </div>
        <div class="end">
            <div
                v-if="!indexed || settings.showInlineFavIcon"
                class="fav"
                :class="{ shown: is_fav && settings.highlightFavoriteTracks }"
                @click.stop.prevent="toggleFav"
            >
                <HeartSvg :state="is_fav" :no_emit="true" />
            </div>
            <div class="duration">{{ formatSeconds(row.duration ?? 0) }}</div>
            <div v-if="track" class="options circular" @click.stop.prevent="showMenu" @dblclick.stop>
                <MoreSvg />
            </div>
            <div v-else class="menu-space"></div>
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import { paths } from '@/config'
import { favType } from '@/enums'
import { showTrackContextMenu } from '@/helpers/contextMenuHandler'
import favoriteHandler from '@/helpers/favoriteHandler'
import { useT } from '@/i18n'
import { Track, WorkTile } from '@/interfaces'
import { Routes } from '@/router'
import { formatSeconds } from '@/utils'
import { isSmall } from '@/stores/content-width'
import useSettings from '@/stores/settings'
import composerTint from '@/utils/composerTint'

import MoreSvg from '@/assets/icons/more.svg'
import HeartSvg from '@/components/shared/HeartSvg.vue'
import TrackIndex from '@/components/shared/SongItem/TrackIndex.vue'

const props = defineProps<{
    // a work row opens the work on its recording
    work?: WorkTile
    // a movement row plays the track
    track?: Track
    isCurrent?: boolean
    // the row's number in a numbered list, as on the favorites page
    index?: number | string
}>()

defineEmits<{
    (e: 'playThis'): void
}>()

const { t } = useT()
const settings = useSettings()
const menuOn = ref(false)
const indexed = computed(() => props.index !== undefined && !isSmall.value)

const is_fav = ref(false)
watch(
    () => props.work?.is_favorite ?? props.track?.is_favorite,
    value => (is_fav.value = value ?? false),
    { immediate: true }
)

const link = computed(() => ({
    name: Routes.work,
    params: { token: props.work?.workhash },
    query: props.work?.albumhash ? { albumhash: props.work.albumhash } : {},
}))

/**
 * The tile and the three text lines of a work or a movement.
 */
const row = computed(() => {
    const work = props.work
    if (work) {
        const movements = t('Views.WorkView.MovementCount', { n: work.movement_count }, work.movement_count)
        return {
            mark: work.mark,
            tint: work.tint,
            composer: work.composer,
            title: work.name,
            nickname: work.nickname,
            sub: [work.catalogue, movements].filter(Boolean).join(' · '),
            duration: work.duration,
        }
    }
    const info = props.track!.classical!
    return {
        mark: '',
        tint: null,
        composer: info.composer,
        title: info.title,
        nickname: null,
        sub: info.sub,
        duration: props.track!.duration,
    }
})

/**
 * Favorite the work on this row's recording, or the movement's track.
 */
function toggleFav() {
    const work = props.work
    const set = () => (is_fav.value = true)
    const unset = () => (is_fav.value = false)
    if (work) {
        favoriteHandler(is_fav.value, favType.work, work.workhash, set, unset, work.albumhash ?? undefined)
    } else if (props.track) {
        favoriteHandler(is_fav.value, favType.track, props.track.trackhash, set, unset)
    }
}

function showMenu(e: MouseEvent) {
    if (props.track) showTrackContextMenu(e, props.track, menuOn)
}
</script>

<style lang="scss">
.search-work-row {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr) max-content;
    align-items: center;
    gap: 1rem;
    height: 64px;
    padding-left: $small;
    color: inherit;
    cursor: pointer;
    user-select: none;

    &:hover,
    &.menu {
        background-color: $gray5;

        .fav {
            @include fav-revealed;
        }
    }

    // a number column before the tile, as SongItem's
    &.indexed {
        grid-template-columns: 1.75rem 3rem minmax(0, 1fr) max-content;
        @include fav-index;
    }

    .tile {
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: flex-end;
        padding: 0.3rem;
        border-radius: 0.4rem;
        background: var(--tile-bg);
        box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--tile-label) 16%, transparent);
        color: var(--tile-label);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 0.7rem;
        line-height: 1;
        overflow: hidden;

        span {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.05;
        }

    }

    .thumb {
        width: 3rem;
        height: 3rem;
        object-fit: cover;
        border-radius: 4px;
    }

    .text {
        min-width: 0;
    }

    .composer {
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: $gray1;
    }

    .title {
        font-weight: 600;
        margin: 1px 0;

        // as the work header's names line
        .nickname {
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-weight: 400;
        }
    }

    &.current .title {
        color: $blue;
    }

    .sub {
        font-size: 0.85rem;
        color: $gray1;
    }

    // laid out like SongItem's TrackDuration, with an empty space for work rows where its menu button sits
    .end {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-right: $small;
    }

    .fav {
        width: 28px;
        height: 28px;
        margin-right: $small;
        user-select: none;
        @include fav-hidden;

        &.shown {
            visibility: visible;
            opacity: 1;
            transform: scale(0.8);
        }

        svg {
            color: $red;
        }

        > .heart-button {
            all: unset !important;
        }

        @include mediumPhones {
            display: none !important;
        }
    }

    .duration {
        font-size: 0.85rem;
        color: $gray1;
        font-variant-numeric: tabular-nums;

        @include mediumPhones {
            display: none;
        }
    }

    .menu-space,
    .options {
        width: 2rem;
        flex-shrink: 0;
    }

    .options {
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        transition: background-color 0.2s ease-out;

        svg {
            stroke: $gray1;
        }

        &:hover {
            background-color: $gray3;
        }
    }
}
</style>
