<template>
    <input
        id="progress"
        type="range"
        :value="time.current"
        min="0"
        :max="time.full"
        step="0.1"
        :style="{
            background: `#3a3a3c linear-gradient(90deg, white ${currentPercent}%, #48484a ${currentPercent}%, #48484a ${loadedPercent}%, #3a3a3c ${loadedPercent}%)`,
        }"
        @change="seek"
        @click="seek"
    />
</template>

<script setup lang="ts">
import { maxSeekPercent } from '@/stores/player'
import useQStore from '@/stores/queue'
import useRemote from '@/stores/remote'
import { computed } from 'vue'

const q = useQStore()
const remote = useRemote()

// a Remote Control controller has no audio of its own, so nothing is loaded
const loadedPercent = computed(() => (remote.connected && !remote.isActive ? 0 : maxSeekPercent.value))

const { duration: time } = q

let prevHash = ''

const seek = (e: Event) => {
    if (prevHash && prevHash !== q.currenttrackhash) {
        prevHash = ''
        return
    }

    const elem = e.target as HTMLInputElement
    const value = elem.value

    prevHash = q.currenttrackhash
    q.seek(value as unknown as number)
}

const currentPercent = computed(() => (time.current / (time.full || 1)) * 100)
</script>
