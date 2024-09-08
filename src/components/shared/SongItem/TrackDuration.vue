<template>
    <div class="options-and-duration">
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

defineProps<{
    duration: number
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

    .song-duration {
        font-size: small;
        font-variant-numeric: tabular-nums;
        text-align: left;

        @include mediumPhones {
            display: none;
        }

        transition: opacity 0.1s ease-out;
    }

    .song-duration.help-text {
        position: absolute;
        // INFO: 3 rem is the width of the options icon (2rem) plus the gap of the flex container (1rem)
        right: 3rem;
        font-size: $medium;
        text-transform: uppercase;
        color: $orange;
        opacity: 0;
        transition: opacity 0.1s ease-out;
    }

    .options-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        aspect-ratio: 1;
        width: 2rem;
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
