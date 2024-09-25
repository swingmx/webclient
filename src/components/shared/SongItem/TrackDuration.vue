<template>
    <div class="options-and-duration">
        <div v-if="is_fav && showFavIcon !== false" class="heart-icon is-favorited">
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
    showFavIcon?: boolean
    help_text?: string
}>()

defineEmits<{
    (e: 'showMenu', event: MouseEvent): void
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

    @include allPhones {
        gap: $small;
    }

    @include mediumPhones {
        > .heart-icon.is-favorited {
            display: none;
        }
    }

    > .heart-icon.is-favorited {
        display: block;
        width: 28px;
        height: 28px;
        user-select: none;
        pointer-events: none;
        transition: opacity 0.2s ease-out;

        > .heart-button {
            all: unset !important;
        }
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
