<template>
    <div class="queue-work-head above" :class="{ below: last }">
        <div
            class="row"
            :class="{ playable: !!movement, current: isCurrent }"
            @click="movement && $emit('playThis')"
            @contextmenu.prevent="movement && showMenu($event)"
        >
            <div class="info">
                <div v-if="work.composer" class="composer ellip">
                    <RouterLink
                        v-if="work.composer_hash"
                        :to="{ name: Routes.artist, params: { hash: work.composer_hash } }"
                        @click.stop
                    >
                        {{ work.composer }}
                    </RouterLink>
                    <template v-else>{{ work.composer }}</template>
                </div>
                <div class="title ellip">
                    <RouterLink
                        :to="{
                            name: Routes.work,
                            params: { token: work.workhash },
                            query: albumhash ? { albumhash } : {},
                        }"
                        @click.stop
                    >
                        {{ work.name }}
                    </RouterLink>
                    <span v-if="work.nickname || work.subtitle" class="nickname"
                        >“{{ work.nickname || work.subtitle }}”</span
                    >
                    <span v-if="!movement" class="play" @click.stop="$emit('playThis')">
                        <PlaySvg /> {{ $t('Common.Play') }}
                    </span>
                </div>
                <div v-if="notes" class="notes ellip">{{ notes }}</div>
            </div>
            <button
                v-if="movement"
                class="remove"
                :title="$t('TrackItem.RemoveFromQueue')"
                @click.stop="tracklist.removeByIndex(trackIndex!)"
            >
                <DelSvg />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { showTrackContextMenu } from '@/helpers/contextMenuHandler'
import { useT } from '@/i18n'
import { ClassicalMovement, QueueWork } from '@/interfaces'
import { Routes } from '@/router'
import useTracklist from '@/stores/queue/tracklist'
import sameTitle from '@/utils/sameTitle'

import DelSvg from '@/assets/icons/plus.svg'
import PlaySvg from '@/assets/icons/play.svg'

const props = defineProps<{
    work: QueueWork
    // the album the run's movements are from
    albumhash?: string
    // queued movements of the work in this run
    count: number
    // the run's only movement: the head plays it and holds its remove button
    movement?: ClassicalMovement
    trackIndex?: number
    isCurrent?: boolean
    // the queue's last row: a line below it too
    last?: boolean
}>()

defineEmits<{
    (e: 'playThis'): void
}>()

const { t } = useT()
const tracklist = useTracklist()
const menuOn = ref(false)

/**
 * The movement a single queued track holds when it is not the whole work,
 * the catalogue ids, and the movement count of a longer run.
 */
const notes = computed(() => {
    const title = props.movement?.movement_title?.trim()
    const excerpt = title && !sameTitle(title, props.work.name) ? title : ''
    const parts = [excerpt, ...props.work.catalogue_ids.map(id => id.name)]
    if (props.count > 1) parts.push(t('Views.WorkView.MovementCount', { n: props.count }, props.count))
    return parts.filter(Boolean).join(' · ')
})

function showMenu(e: MouseEvent) {
    if (props.movement) showTrackContextMenu(e, props.movement, menuOn)
}
</script>

<style lang="scss">
.queue-work-head {
    @include queue-work-lines;

    .row {
        display: grid;
        // the last column matches the remove button on movement rows
        grid-template-columns: minmax(0, 1fr) 1.75rem;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.5rem 0.5rem 0.75rem;
        border-radius: $small;

        &.playable {
            cursor: pointer;

            &:hover {
                background-color: $gray5;
            }
        }

        &.current {
            background-color: $gray;
        }
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
    }

    .title {
        font-size: 1.1rem;
        font-weight: 600;

        .nickname {
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-weight: 400;
            margin-left: $smaller;
        }

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
    }

    &:hover .title .play {
        opacity: 1;
    }

    .composer a,
    .title a {
        color: inherit;

        &:hover {
            text-decoration: underline;
        }
    }

    .notes {
        font-size: 0.9rem;
        color: $gray1;
    }

    .remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        padding: 0;
        background: none;
        border: none;
        color: $gray1;
        // shown while the row is hovered; Now Playing keeps it shown
        opacity: 0;
        cursor: pointer;

        svg {
            height: 1.25rem;
            transform: rotate(45deg);
        }
    }

    .row:hover .remove {
        opacity: 0.6;
    }

    .row .remove:hover {
        opacity: 1;
    }
}
</style>
