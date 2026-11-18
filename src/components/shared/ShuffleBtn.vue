<template>
    <button
        v-wave
        class="shufflebtn-rect circular"
        :title="$t('RightSidebar.Shuffle')"
        :aria-label="$t('RightSidebar.Shuffle')"
        @click="source && playFrom(source, true)"
    >
        <ShuffleSvg />
    </button>
</template>

<script setup lang="ts">
import { playSources } from '@/enums'
import { playFrom } from '@/helpers/usePlayFrom'

import ShuffleSvg from '@/assets/icons/shuffle.svg'

defineProps<{
    // without a source, the parent handles the click
    source?: playSources
}>()
</script>

<style lang="scss">
.shufflebtn-rect {
    width: 3rem;
    padding: 0;
    background-color: transparent;
    border: solid 1px color-mix(in srgb, currentColor 35%, transparent);

    &:hover {
        background-color: color-mix(in srgb, currentColor 12%, transparent);
    }

    svg {
        height: 1.25rem;
    }
}
</style>
