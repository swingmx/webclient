<template>
    <div
        class="track-item noSelect"
        :class="[
            {
                currentInQueue: isCurrent,
            },
            { contexton: context_on },
            { 'is-classical-track': isClassicalTrack },
            { numbered },
        ]"
        @click.prevent.stop="playThis"
        @dblclick.prevent.stop="() => emit('playThis')"
        @contextmenu.prevent="showMenu"
    >
        <div v-if="numbered" class="movement-number" :class="{ current: isCurrent }">
            {{ movementNumber }}
        </div>
        <div v-else class="album-art">
            <img :src="paths.images.thumb.small + track.image" />
            <div
                v-if="isCurrent"
                class="now-playing-track-indicator image"
                :class="{ last_played: !isCurrentPlaying }"
            ></div>
            <HeartSvg :state="is_fav" :no_emit="true" @click.stop="() => addToFav(track.trackhash)" />
        </div>
        <div class="tags">
            <div v-tooltip class="title" @click.prevent.stop="() => emit('playThis')">
                <span class="ellip"> {{ track.title }} </span>
            </div>
            <hr v-if="!numbered" />
            <div v-if="!numbered" class="artist">
                <ArtistName :artists="track.artists" :albumartists="track.albumartists" :smaller="true" />
            </div>
        </div>
        <TrackDuration
            v-if="!isQueueTrack && isClassicalTrack"
            :duration="track.duration ?? 0"
            :is_fav="is_fav"
            :show-inline-fav-icon="false"
            :highlight-favorite-tracks="false"
            @showMenu="showMenu"
            @toggleFav="() => addToFav(track.trackhash)"
        />
        <div class="float-buttons flex">
            <!-- <div
                v-if="!isClassicalTrack"
                class="fav-icon"
                :title="is_fav ? $t('TrackItem.AddToFavorites') : $t('TrackItem.RemoveFromFavorites')"
                @click.stop="() => addToFav(track.trackhash)"
            >
                <HeartSvg :state="is_fav" :no_emit="true" />
            </div> -->
            <div
                v-if="isQueueTrack"
                class="remove-track"
                :title="$t('TrackItem.RemoveFromQueue')"
                @click.stop="player.removeByIndex(index)"
            >
                <DelSvg />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import useTracklist from '@/stores/queue/tracklist'

import { paths } from '@/config'
import { favType } from '@/enums'
import { showTrackContextMenu as showContext } from '@/helpers/contextMenuHandler'
import favoriteHandler from '@/helpers/favoriteHandler'
import { ClassicalMovement, Track } from '@/interfaces'

import DelSvg from '@/assets/icons/plus.svg'
import ArtistName from './ArtistName.vue'
import HeartSvg from './HeartSvg.vue'
import TrackDuration from './SongItem/TrackDuration.vue'

const props = defineProps<{
    track: Track | ClassicalMovement
    isCurrent: boolean
    isCurrentPlaying: boolean
    isQueueTrack?: boolean
    index?: number
    isClassicalTrack?: boolean
    numbered?: boolean
}>()

const movementNumber = computed(() => ('movement_number' in props.track ? props.track.movement_number : null) ?? '')

const player = useTracklist()
const context_on = ref(false)
const is_fav = ref(props.track.is_favorite)

function showMenu(e: MouseEvent) {
    showContext(e, props.track, context_on)
}

const emit = defineEmits<{
    (e: 'playThis'): void
}>()

const playThis = () => {
    if (!props.isQueueTrack) {
        return
    }

    emit('playThis')
}

function addToFav(trackhash: string) {
    favoriteHandler(
        is_fav.value,
        favType.track,
        trackhash,
        () => (is_fav.value = true),
        () => (is_fav.value = false)
    )
}

const stop = watch(
    () => props.track.is_favorite,
    newValue => {
        is_fav.value = newValue
    }
)

onBeforeUnmount(() => {
    stop()
})
</script>

<style lang="scss">
.track-item.currentInQueue {
    background-color: $gray;
    color: rgb(229, 229, 229);
}

.contexton {
    background-color: $gray4;
    color: $white !important;
}

.track-item.numbered {
    padding: 1.25rem $small;
    border-radius: 0;
    border-top: solid 1px $gray5;

    .movement-number {
        width: 3rem;
        margin-right: $medium;
        display: flex;
        justify-content: center;
        position: relative;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 1.35rem;
        color: $gray1;

        &.current {
            color: $white;
        }
    }

    .tags .title {
        font-size: 1.1rem;
    }
}

.track-item {
    display: grid;
    grid-template-columns: min-content 1fr max-content max-content;
    align-items: center;
    padding: $small;
    transition: background-color 0.2s ease-out;
    border-radius: 8px;

    &.is-queue-track {
        grid-template-columns: min-content 1fr max-content;
    }

    .tags {
        .title {
            width: fit-content;
            font-weight: 600;
            cursor: pointer;
        }
    }

    .float-buttons {
        opacity: 0;
        gap: $small;

        & > * {
            cursor: pointer;
        }

        .heart-button {
            width: 1.75rem;
            height: 1.75rem;
            padding: 0;
            border: none;
            background-color: transparent;
        }

        .remove-track {
            transform: rotate(45deg);
            height: 1.75rem;
            width: 1.75rem;

            display: grid;
            place-items: center;

            &:hover {
                border-radius: 1rem;
            }
        }

        &:hover {
            opacity: 1 !important;
        }
    }

    &:hover {
        background-color: $gray5;
        color: $white !important;

        .float-buttons {
            opacity: 1;
        }

        .remove-track {
            transform: translateY(0) rotate(45deg);
        }

        .heart-button {
            opacity: 1;
        }
    }

    hr {
        border: none;
        margin: 0.1rem;
    }

    .album-art {
        display: flex;
        align-items: center;
        justify-content: center;

        margin-right: $medium;
        position: relative;

        img {
            border-radius: 4px;
        }

        .now-playing-track-indicator {
            position: absolute;
        }
    }

    img {
        width: 3rem;
        height: 3rem;
        object-fit: cover;
        object-position: top left;
    }

    .artist {
        opacity: 0.67;
        width: fit-content;
        font-weight: 700;
    }

    .heart-button {
        position: absolute;
        right: 0;
        top: 0;
        height: 3rem;
        width: 3rem;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
    }
}
</style>
