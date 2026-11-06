<template>
    <div v-if="device" class="rc-strip">
        <VolumeLowSvg />
        {{ $t('RemoteControl.PlayingOnDevice', { device: deviceTitle(device, rc.hostId) }) }}
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import VolumeLowSvg from '@/assets/icons/volume-low.svg'
import useRemote from '@/stores/remote'
import { deviceTitle } from '@/utils/remoteDevices'

const rc = useRemote()

const device = computed(() => {
    if (!rc.connected || !rc.reachable || rc.activeHostId === rc.hostId) return
    return rc.devices.find(d => d.id === rc.activeHostId)
})
</script>

<style lang="scss">
.rc-strip {
    grid-area: rcstrip;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: $small;
    padding: $small 1.5rem;
    font-weight: 600;
    color: rgb(255, 153, 0);
    background-color: rgba(255, 153, 0, 0.08);

    svg {
        height: 1.25rem;
        width: 1.25rem;
    }
}
</style>
