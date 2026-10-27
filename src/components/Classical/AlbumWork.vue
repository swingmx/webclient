<template>
    <div class="album-work" :class="{ single, first }">
        <div
            class="work-head"
            :class="{ playable: single, current: single && isCurrent(movements[0]) }"
            @click="single && $emit('playThis', movements[0].trackhash)"
            @contextmenu.prevent="single && showMenu($event, movements[0])"
        >
            <TrackIndex
                v-if="work.workhash"
                :index="single ? movements[0].track : ''"
                :is_fav="work.is_favorite"
                :show-inline-fav-icon="false"
                @click.stop
                @add-to-fav="toggleFavorite"
            />
            <div v-else class="number">{{ single ? movements[0].track : '' }}</div>
            <div class="info">
                <div v-if="work.composer" class="composer">
                    <RouterLink
                        v-if="work.composer_hash"
                        :to="{ name: Routes.artist, params: { hash: work.composer_hash } }"
                        @click.stop
                    >
                        {{ work.composer }}
                    </RouterLink>
                    <template v-else>{{ work.composer }}</template>
                </div>
                <div class="title">
                    <RouterLink
                        v-if="work.workhash"
                        :to="{ name: Routes.work, params: { token: work.workhash }, query: { albumhash } }"
                        @click.stop
                    >
                        {{ work.name }}
                    </RouterLink>
                    <template v-else>{{ work.name }}</template>
                    <span v-if="nickname" class="nickname">“{{ nickname }}”</span>
                    <span v-if="!single" class="play" @click.stop="$emit('playWork', work.workhash)">
                        <PlaySvg /> {{ $t('Common.Play') }}
                    </span>
                </div>
                <div v-if="single ? work.excerpt || notes : notes" class="meta">
                    <span v-if="single && work.excerpt" class="excerpt">{{ work.excerpt }}</span>
                    <span v-if="notes" class="notes">{{ notes }}</span>
                </div>
            </div>
            <div class="duration" :class="{ total: !single }">{{ formatSeconds(work.duration ?? 0) }}</div>
            <button v-if="single" class="menu" :class="{ on: menuOn }" @click.stop="showMenu($event, movements[0])">
                <MoreSvg />
            </button>
            <div v-else class="menu"></div>
        </div>
        <template v-if="!single">
            <div
                v-for="movement in movements"
                :key="movement.trackhash"
                class="movement"
                :class="{ current: isCurrent(movement) }"
                @click="$emit('playThis', movement.trackhash)"
                @contextmenu.prevent="showMenu($event, movement)"
            >
                <TrackIndex
                    :index="movement.track"
                    :is_fav="movement.is_favorite"
                    :show-inline-fav-icon="settings.showInlineFavIcon"
                    @click.stop
                    @add-to-fav="toggleTrackFavorite(movement)"
                />
                <div class="name ellip">
                    {{ movement.movement_title }}
                    <span v-if="movement.arrangement" class="notes">{{ movement.arrangement }}</span>
                </div>
                <div class="duration">
                    <div
                        v-if="settings.showInlineFavIcon"
                        class="inline-fav"
                        :class="{ is_fav: movement.is_favorite && settings.highlightFavoriteTracks }"
                        @click.stop="toggleTrackFavorite(movement)"
                    >
                        <HeartSvg :state="movement.is_favorite" :no_emit="true" />
                    </div>
                    {{ formatSeconds(movement.duration ?? 0) }}
                </div>
                <button class="menu" @click.stop="showMenu($event, movement)">
                    <MoreSvg />
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { favType } from '@/enums'
import { showTrackContextMenu } from '@/helpers/contextMenuHandler'
import favoriteHandler from '@/helpers/favoriteHandler'
import { useT } from '@/i18n'
import { ClassicalMovement, ClassicalWork } from '@/interfaces'
import { Routes } from '@/router'
import useQueueStore from '@/stores/queue'
import useSettings from '@/stores/settings'
import formatSeconds from '@/utils/useFormatSeconds'

import MoreSvg from '@/assets/icons/more.svg'
import PlaySvg from '@/assets/icons/play.svg'
import HeartSvg from '@/components/shared/HeartSvg.vue'
import TrackIndex from '@/components/shared/SongItem/TrackIndex.vue'

const props = defineProps<{
    work: ClassicalWork
    albumhash: string
    first?: boolean
}>()

defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: 'playThis', trackhash: string): void
    // eslint-disable-next-line no-unused-vars
    (event: 'playWork', workhash: string): void
}>()

const { t } = useT()
const queue = useQueueStore()
const settings = useSettings()
const menuOn = ref(false)

const movements = computed(() => props.work.movements)
const single = computed(() => movements.value.length === 1)
const nickname = computed(() => props.work.nickname || props.work.subtitle)

const notes = computed(() => {
    const parts: string[] = []
    if (props.work.arrangement) parts.push(props.work.arrangement)
    parts.push(...props.work.catalogue_ids.map(id => id.name))
    if (!single.value) parts.push(t('Views.WorkView.MovementCount', { n: movements.value.length }, movements.value.length))
    return parts.join(' · ')
})

function isCurrent(movement: ClassicalMovement) {
    return queue.currenttrack?.trackhash === movement.trackhash
}

/**
 * Favorite the work, remembering this album's recording so a favorites
 * entry opens it.
 */
function toggleFavorite() {
    const work = props.work
    favoriteHandler(
        work.is_favorite,
        favType.work,
        work.workhash,
        () => (work.is_favorite = true),
        () => (work.is_favorite = false),
        props.albumhash
    )
}

function toggleTrackFavorite(movement: ClassicalMovement) {
    favoriteHandler(
        movement.is_favorite,
        favType.track,
        movement.trackhash,
        () => (movement.is_favorite = true),
        () => (movement.is_favorite = false)
    )
}

function showMenu(e: MouseEvent, movement: ClassicalMovement) {
    showTrackContextMenu(e, movement, menuOn)
}
</script>

<style lang="scss">
.album-work {
    border-top: solid 1px $gray5;
    padding: 0.5rem 0;

    &.first {
        border-top: none;
        padding-top: 2rem;
    }

    .work-head,
    .movement {
        display: grid;
        grid-template-columns: 2.5rem 1fr max-content 2.5rem;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.5rem;
        border-radius: $small;
    }

    .work-head,
    .movement {
        @include fav-index;

        // as tall as the row's content, not the song row's 3rem
        > .index {
            height: auto;
            align-self: stretch;
        }
    }

    .work-head.playable,
    .movement {
        cursor: pointer;

        &:hover {
            background-color: $gray5;
        }
    }

    .number {
        text-align: center;
        font-size: 0.85rem;
        color: $gray1;
        font-variant-numeric: tabular-nums;
    }

    .work-head:hover .title .play {
        opacity: 1;
    }

    .work-head.current,
    .movement.current {
        background-color: $gray;
    }

    .info {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .composer {
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: $gray1;

        a {
            color: inherit;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .title {
        font-size: 1.1rem;
        font-weight: 600;

        .play {
            display: inline-flex;
            align-items: center;
            gap: $smaller;
            margin-left: $small;
            font-size: 0.8rem;
            font-weight: 500;
            color: $gray1;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease-out;

            svg {
                height: 12px;
            }
        }

        a {
            color: inherit;

            &:hover {
                text-decoration: underline;
            }
        }

        .nickname {
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-weight: 400;
            margin-left: $smaller;
        }
    }

    .meta {
        font-size: 0.9rem;

        .excerpt {
            margin-right: 0.75rem;
        }
    }

    .notes {
        color: $gray1;
    }

    .movement .notes {
        margin-left: 0.75rem;
        font-size: 0.9rem;
    }

    .duration {
        display: flex;
        align-items: center;
        gap: $small;
        font-size: 0.9rem;
        font-variant-numeric: tabular-nums;

        &.total {
            color: $gray1;
        }
    }

    .inline-fav {
        display: none;
        width: 28px;
        height: 28px;
        transform: scale(0.8);

        svg {
            color: $red;
        }

        > .heart-button {
            all: unset !important;
        }

        &.is_fav {
            display: block;
        }
    }

    .movement:hover .inline-fav {
        display: block;
    }

    .menu {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: none;
        border: none;
        color: $gray1;
        opacity: 0.6;

        &:hover,
        &.on {
            opacity: 1;
        }

        svg {
            height: 1.25rem;
        }
    }
}
</style>
