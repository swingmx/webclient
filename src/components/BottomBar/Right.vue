<template>
    <div class="right-group">
        <LyricsButton />
        <Volume />
        <button
            class="cast"
            :class="{ 
                'cast-connected': cast.isConnected, 
                'cast-connecting': cast.isConnecting,
                'cast-disabled': !cast.isSupported
            }"
            :title="!cast.isSupported ? 'Cast SDK loading...' : cast.isConnected ? 'Disconnect from cast device' : cast.isConnecting ? 'Connecting...' : 'Cast to device'"
            @click="cast.toggleCast"
        >
            <CastSvg />
        </button>
        <button
            class="repeat"
            :class="{ 'repeat-disabled': settings.repeat == 'none' }"
            :title="settings.repeat == 'all' ? 'Repeat all' : settings.repeat == 'one' ? 'Repeat one' : 'No repeat'"
            @click="settings.toggleRepeatMode"
        >
            <RepeatOneSvg v-if="settings.repeat == 'one'" />
            <RepeatAllSvg v-else />
        </button>
        <button title="Shuffle" @click="queue.shuffleQueue">
            <ShuffleSvg />
        </button>
        <HeartSvg
            v-if="!hideHeart"
            title="Favorite"
            :state="queue.currenttrack?.is_favorite"
            @handleFav="() => $emit('handleFav')"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useQueue from '@/stores/queue'
import useSettings from '@/stores/settings'
import useCast from '@/composables/useCast'

import RepeatOneSvg from '@/assets/icons/repeat-one.svg'
import RepeatAllSvg from '@/assets/icons/repeat.svg'
import ShuffleSvg from '@/assets/icons/shuffle.svg'
import CastSvg from '@/assets/icons/cast.svg'
import HeartSvg from '../shared/HeartSvg.vue'
import LyricsButton from '../shared/LyricsButton.vue'
import Volume from './Volume.vue'

const queue = useQueue()
const settings = useSettings()
const cast = useCast()

onMounted(() => {
    cast.initCast()
})

defineProps<{
    hideHeart?: boolean
}>()

defineEmits<{
    (event: 'handleFav'): void
}>()
</script>

<style lang="scss">
.right-group {
    display: grid;
    justify-content: flex-end;
    grid-template-columns: repeat(6, max-content);
    align-items: center;
    height: 4rem;

    @include allPhones {
        width: max-content;
        height: unset;
    }

    button {
        height: 3rem !important;
        width: 3rem !important;
        background-color: transparent;
        border: solid 1px transparent;

        &:hover {
            border: solid 1px $gray3 !important;
            background-color: $gray !important;
        }
    }

    .lyrics,
    .repeat,
    .cast {
        svg {
            transform: scale(0.75);
        }

        &:active > svg {
            transform: scale(0.6);
        }
    }

    .cast {
        &.cast-connected {
            background-color: $primary !important;
            border-color: $primary !important;
            
            svg {
                color: white;
            }

            &:hover {
                background-color: $primary !important;
                border-color: $primary !important;
                opacity: 0.8;
            }
        }

        &.cast-connecting {
            svg {
                opacity: 0.7;
            }
        }

        &.cast-disabled {
            svg {
                opacity: 0.3;
            }
            
            &:hover {
                background-color: transparent !important;
                border-color: transparent !important;
            }
        }
    }

    button.repeat.repeat-disabled {
        svg {
            opacity: 0.25;
        }
    }

    .heart-button {
        border: solid 1px $gray4 !important;
    }
}
</style>
