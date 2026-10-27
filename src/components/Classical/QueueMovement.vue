<template>
    <div class="queue-movement" :class="{ below: last }">
        <div
            class="row"
            :class="{ current: isCurrent, menu: menuOn }"
            @click="$emit('playThis')"
            @contextmenu.prevent="showMenu"
        >
            <div class="name ellip">{{ movement.movement_title || movement.title }}</div>
            <div class="end">
                <div class="fav" :class="{ shown: is_fav && settings.highlightFavoriteTracks }" @click.stop="toggleFav">
                    <HeartSvg :state="is_fav" :no_emit="true" />
                </div>
                <button
                    class="action remove"
                    :title="$t('TrackItem.RemoveFromQueue')"
                    @click.stop="tracklist.removeByIndex(index)"
                >
                    <DelSvg />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { favType } from '@/enums'
import { showTrackContextMenu } from '@/helpers/contextMenuHandler'
import favoriteHandler from '@/helpers/favoriteHandler'
import { ClassicalMovement } from '@/interfaces'
import useTracklist from '@/stores/queue/tracklist'
import useSettings from '@/stores/settings'

import DelSvg from '@/assets/icons/plus.svg'
import HeartSvg from '@/components/shared/HeartSvg.vue'

const props = defineProps<{
    movement: ClassicalMovement
    // the movement's position in the queue
    index: number
    isCurrent?: boolean
    // the queue's last row: a line below it
    last?: boolean
}>()

defineEmits<{
    (e: 'playThis'): void
}>()

const tracklist = useTracklist()
const settings = useSettings()
const menuOn = ref(false)

const is_fav = ref(false)
watch(
    () => props.movement.is_favorite,
    value => (is_fav.value = value ?? false),
    { immediate: true }
)

function toggleFav() {
    favoriteHandler(
        is_fav.value,
        favType.track,
        props.movement.trackhash,
        () => (is_fav.value = true),
        () => (is_fav.value = false)
    )
}

function showMenu(e: MouseEvent) {
    showTrackContextMenu(e, props.movement, menuOn)
}
</script>

<style lang="scss">
.queue-movement {
    @include queue-work-lines;

    .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) max-content;
        align-items: center;
        gap: 0.75rem;
        height: 2.75rem;
        padding: 0 0.5rem 0 0.75rem;
        border-radius: $small;
        cursor: pointer;

        &:hover,
        &.menu {
            background-color: $gray5;

            .fav {
                @include fav-revealed;
            }
        }

        &.current {
            background-color: $gray;
        }
    }

    .end {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .fav {
        width: 28px;
        height: 28px;
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
    }

    .action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        padding: 0;
        background: none;
        border: none;
        color: $gray1;
        opacity: 0.6;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }

        svg {
            height: 1.25rem;
        }
    }

    .remove {
        // shown while the row is hovered; Now Playing keeps it shown
        opacity: 0;

        svg {
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
