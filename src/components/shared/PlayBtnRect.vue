<template>
    <button
        v-wave
        class="playbtnrect shadow-sm circular btn-active"
        :style="{
            backgroundColor: bg_color ? bg_color : '',
            borderColor: bg_color ? bg_color : '',
            color: bg_color ? getShift(bg_color, [100, 100]) : '',
        }"
        @click="playFrom(source)"
    >
        <playBtnSvg />
        <div class="text">Play</div>
    </button>
</template>

<script setup lang="ts">
import { playSources } from '@/enums'
import { getShift } from '@/utils/colortools/shift'

import playBtnSvg from '@/assets/icons/play.svg'
import { playFrom } from '@/helpers/usePlayFrom'

defineProps<{
    source: playSources
    bg_color?: string
}>()
</script>

<style lang="scss">
.playbtnrect {
    width: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    padding-right: 1rem;

    svg {
        height: 1.75rem;
    }
}
</style>
