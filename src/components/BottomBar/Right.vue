<template>
    <div class="right-group">
        <Devices />
        <LyricsButton />
        <Volume />
        <button
            class="repeat"
            :class="{ 'repeat-disabled': settings.repeat == 'none' }"
            :title="settings.repeat == 'all' ? $t('BottomBar.RepeatOptions.All') : settings.repeat == 'one' ? $t('BottomBar.RepeatOptions.One') : $t('BottomBar.RepeatOptions.None')"
            @click="settings.toggleRepeatMode"
        >
            <RepeatOneSvg v-if="settings.repeat == 'one'" />
            <RepeatAllSvg v-else />
        </button>
        <button
            class="shuffle"
            :class="{ 'shuffle-off': rc.connected ? !rc.shuffled : !tracklist.shuffled }"
            :title="$t('BottomBar.Shuffle')"
            @click="queue.shuffleQueue"
        >
            <ShuffleSvg />
        </button>
        <HeartSvg
            v-if="!hideHeart"
            :title="$t('BottomBar.Favorite')"
            :state="queue.currenttrack?.is_favorite"
            @handleFav="() => $emit('handleFav')"
        />
    </div>
</template>

<script setup lang="ts">
import useQueue from '@/stores/queue'
import useSettings from '@/stores/settings'
import useRemote from '@/stores/remote'
import useTracklist from '@/stores/queue/tracklist'


import RepeatOneSvg from '@/assets/icons/repeat-one.svg'
import RepeatAllSvg from '@/assets/icons/repeat.svg'
import ShuffleSvg from '@/assets/icons/shuffle.svg'
import HeartSvg from '../shared/HeartSvg.vue'
import LyricsButton from '../shared/LyricsButton.vue'
import Volume from './Volume.vue'
import Devices from './Devices.vue'

const queue = useQueue()
const settings = useSettings()
const rc = useRemote()
const tracklist = useTracklist()

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

    .shuffle {
        padding: $small $smallest !important;
    }

    .lyrics,
    .repeat,
    .shuffle {
        svg {
            height: 1.5rem;
            width: 1.5rem;
        }

        &:active > svg {
            transform: scale(0.6);
        }
    }

    .speaker svg {
        height: 1.35rem;
        width: 1.35rem;
    }

    button.repeat.repeat-disabled,
    button.shuffle.shuffle-off {
        svg {
            opacity: 0.25;
        }
    }

    .heart-button {
        border: solid 1px $gray4 !important;
    }
}
</style>
