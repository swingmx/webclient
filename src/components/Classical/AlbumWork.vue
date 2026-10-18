<template>
    <div class="album-work" :class="{ single, first }">
        <div
            class="work-head"
            :class="{ playable: single, current: single && isCurrent(movements[0]) }"
            @click="single && $emit('playThis', movements[0].trackhash)"
            @contextmenu.prevent="single && showMenu($event, movements[0])"
        >
            <div class="number">{{ single ? movements[0].track : '' }}</div>
            <div class="info">
                <div v-if="work.composer" class="composer">
                    <RouterLink
                        v-if="work.composer_hash"
                        :to="{ name: Routes.composer, params: { hash: work.composer_hash } }"
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
                </div>
                <div v-if="single ? excerpt || notes : notes" class="meta">
                    <span v-if="single && excerpt" class="excerpt">{{ excerpt }}</span>
                    <span v-if="notes" class="notes">{{ notes }}</span>
                </div>
                <div v-if="work.performers?.length" class="performers">
                    {{ work.performers.join(', ') }}
                </div>
            </div>
            <div class="duration" :class="{ total: !single }">{{ formatSeconds(totalDuration) }}</div>
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
                <div class="number">{{ movement.track }}</div>
                <div class="name ellip">
                    {{ movement.movement_title }}
                    <span v-if="movement.arrangement && !sharedArrangement" class="notes">{{ movement.arrangement }}</span>
                </div>
                <div class="duration">{{ formatSeconds(movement.duration ?? 0) }}</div>
                <button class="menu" @click.stop="showMenu($event, movement)">
                    <MoreSvg />
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { showTrackContextMenu } from '@/helpers/contextMenuHandler'
import { useT } from '@/i18n'
import { ClassicalMovement, ClassicalWork } from '@/interfaces'
import { Routes } from '@/router'
import useQueueStore from '@/stores/queue'
import formatSeconds from '@/utils/useFormatSeconds'

import MoreSvg from '@/assets/icons/more.svg'

const props = defineProps<{
    work: ClassicalWork
    albumhash: string
    first?: boolean
}>()

defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: 'playThis', trackhash: string): void
}>()

const { t } = useT()
const queue = useQueueStore()
const menuOn = ref(false)

const movements = computed(() => props.work.movements)
const single = computed(() => movements.value.length === 1)
const nickname = computed(() => props.work.nickname || props.work.subtitle)
const totalDuration = computed(() => movements.value.reduce((sum, m) => sum + (m.duration || 0), 0))

/**
 * The movement a single track holds when it is an excerpt of a larger work.
 */
const excerpt = computed(() => {
    const title = movements.value[0]?.movement_title?.trim()
    if (!title || title.toLowerCase() === props.work.name.trim().toLowerCase()) return ''
    return title
})

/**
 * The arrangement every movement shares, shown once in the work's notes.
 */
const sharedArrangement = computed(() => {
    const notes = movements.value.map(m => m.arrangement || '')
    return notes.every(n => n && n === notes[0]) ? notes[0] : ''
})

const notes = computed(() => {
    const parts: string[] = []
    if (sharedArrangement.value) parts.push(sharedArrangement.value)
    parts.push(...props.work.catalogue_ids.map(id => id.name))
    if (!single.value) parts.push(t('Views.WorkView.MovementCount', { n: movements.value.length }, movements.value.length))
    return parts.join(' · ')
})

function isCurrent(movement: ClassicalMovement) {
    return queue.currenttrack?.trackhash === movement.trackhash
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

    .performers {
        font-family: Georgia, 'Times New Roman', serif;
        font-style: italic;
        font-size: 0.9rem;
        color: $gray1;
    }

    .duration {
        font-size: 0.9rem;
        font-variant-numeric: tabular-nums;

        &.total {
            color: $gray1;
        }
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
