<template>
    <div class="options-and-duration">
        <div
            v-if="showInlineFavIcon"
            class="heart-icon"
            :class="{ showInlineFavIcon, 'is_fav': is_fav && highlightFavoriteTracks }"
            @click.stop="$emit('toggleFav')"
        >
            <HeartSvg :state="is_fav" :no_emit="true" />
        </div>
        <div class="song-duration" :class="{ has_help_text: help_text }">{{ formatSeconds(duration) }}</div>
        <div class="song-duration help-text" v-if="help_text">
            {{ help_text }}
        </div>
        <div class="options-icon circular" @click.stop="$emit('showMenu', $event)" @dblclick.stop="() => {}">
            <OptionSvg />
        </div>
    </div>
</template>

<script setup lang="ts">
import OptionSvg from '@/assets/icons/more.svg'
import { formatSeconds } from '@/utils'
import HeartSvg from '../HeartSvg.vue'

defineProps<{
    duration: number
    is_fav: boolean
    showInlineFavIcon: boolean
    highlightFavoriteTracks: boolean
    showFavIcon?: boolean
    help_text?: string
}>()

defineEmits<{
    (e: 'showMenu', event: MouseEvent): void
    (e: 'toggleFav'): void
}>()
</script>

<style lang="scss">
.songlist-item > .options-and-duration {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 1rem;
    margin-right: $small;
    position: relative;

    @include mediumPhones {
        > .heart-icon.is-favorited {
            display: none;
        }
    }

    .heart-icon {
        display: none;
        width: 28px;
        height: 28px;
        user-select: none;
        transition: opacity 0.2s ease-out;
        transform: scale(0.8);
        margin-right: $small;

        svg {
            color: $red;
        }

        @include mediumPhones {
            display: none;
        }

        > .heart-button {
            all: unset !important;
        }
    }

    .heart-icon.is_fav {
        display: block;
    }

    .song-duration {
        font-size: small;
        font-variant-numeric: tabular-nums;
        text-align: left;

        @include mediumPhones {
            display: none;
        }

        transition: opacity 0.2s ease-out;
    }

    .song-duration.help-text {
        position: absolute;
        // INFO: 3 rem is the width of the options icon (2rem) plus the gap of the flex container (1rem)
        right: 3rem;
        font-size: $medium;
        text-transform: uppercase;
        color: $orange;
        opacity: 0;
        transition: opacity 0.2s ease-out;

        @include allPhones {
            right: 2.5rem;
        }
    }

    .options-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        aspect-ratio: 1;
        width: 2rem;
        cursor: pointer;
        transition: background-color 0.2s ease-out;

        svg {
            stroke: $gray1;
        }

        &:hover {
            background-color: $gray3;
        }
    }
}

.songlist-item:hover > .options-and-duration > .heart-icon.is-favorited {
    opacity: 0;
}
</style>
