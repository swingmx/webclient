<template>
    <div v-if="rc.connected" ref="root" class="rc-devices">
        <span v-if="rc.activeName" class="rc-playing-on ellip">
            {{ $t('RemoteControl.PlayingOn', { device: rc.activeName }) }}
        </span>
        <button
            :class="{ elsewhere: rc.activeName }"
            :title="$t('RemoteControl.Devices')"
            @click="rc.pickerOpen = !rc.pickerOpen"
        >
            <LaptopSvg />
        </button>
        <div v-if="rc.pickerOpen" class="rc-picker rounded-sm">
            <template v-if="rc.offerPlayHere">
                <div class="rc-note">{{ $t('RemoteControl.NoActiveDevice') }}</div>
                <button class="rc-device" @click="rc.transfer(rc.deviceId, true)">
                    {{ $t('RemoteControl.PlayHere') }}
                </button>
            </template>
            <button
                v-for="device in targets"
                :key="device.id"
                class="rc-device"
                :class="{ active: device.id === rc.activeId }"
                @click="rc.transfer(device.id)"
            >
                {{ device.name }}
                <span v-if="device.id === rc.deviceId">({{ $t('RemoteControl.ThisBrowser') }})</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'

import LaptopSvg from '@/assets/icons/laptop.svg'
import useRemote from '@/stores/remote'

const rc = useRemote()
const root = ref<HTMLElement | null>(null)

// this tab stays listed: picking it is the gesture that makes it selectable
const targets = computed(() =>
    rc.devices.filter(d => d.selectable || d.id === rc.activeId || d.id === rc.deviceId)
)

onClickOutside(root, () => (rc.pickerOpen = false))
</script>

<style lang="scss">
.rc-devices {
    position: relative;
    display: flex;
    align-items: center;

    .rc-playing-on {
        max-width: 8rem;
        font-size: 0.75rem;
        color: $gray1;
    }

    button.elsewhere {
        color: $green;
    }

    svg {
        height: 1.35rem;
        width: 1.35rem;
    }

    .rc-picker {
        position: absolute;
        right: 0;
        bottom: 3.5rem;
        min-width: 14rem;
        padding: $small;
        background-color: $gray;
        border: solid 1px $gray3;
        display: grid;
        gap: $smaller;

        .rc-note {
            font-size: 0.8rem;
            color: $gray1;
            padding: $smaller;
        }

        button.rc-device {
            width: 100% !important;
            height: 2.5rem !important;
            text-align: left;
            padding: 0 $small;

            &.active {
                color: $green;
            }
        }
    }
}
</style>
