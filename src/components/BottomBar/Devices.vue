<template>
    <div v-if="rc.available" ref="root" class="rc-devices" :class="{ open: rc.pickerOpen }">
        <button
            :class="{ elsewhere: rc.connected && rc.activeName, off: !rc.connected }"
            :aria-label="$t('RemoteControl.Devices')"
        >
            <component :is="controlling ? deviceIcon(active!) : LaptopSvg" />
        </button>
        <div v-if="!rc.connected" class="rc-picker">
            <div class="rc-heading">{{ $t('RemoteControl.PlayingIndependently') }}</div>
            <div class="rc-device current">
                <div class="rc-row">
                    <div class="rc-icon"><LaptopSvg /></div>
                    <div class="rc-text">
                        <div class="rc-name ellip">{{ $t('RemoteControl.ThisBrowser') }}</div>
                        <div class="rc-detail ellip">{{ deviceDetail(self) }} · {{ $t('RemoteControl.NotConnected') }}</div>
                    </div>
                    <div class="rc-bars" :class="{ paused: !queue.playing }"><i /><i /><i /></div>
                </div>
            </div>
            <div class="rc-offline">
                <div class="rc-name">{{ $t('RemoteControl.DisconnectedTitle') }}</div>
                <div class="rc-detail">{{ $t('RemoteControl.DisconnectedHelp') }}</div>
                <button @click="settings.toggleRemoteControl()">{{ $t('RemoteControl.Reconnect') }}</button>
            </div>
        </div>
        <div v-else class="rc-picker">
            <template v-if="active">
                <div class="rc-heading">{{ $t(controlling ? 'RemoteControl.Controlling' : 'RemoteControl.PlayingOn') }}</div>
                <div class="rc-device current">
                    <div class="rc-row">
                        <div class="rc-icon"><component :is="deviceIcon(active)" /></div>
                        <div class="rc-text">
                            <div class="rc-name ellip">{{ deviceTitle(active, rc.hostId) }}</div>
                            <div class="rc-detail ellip">{{ deviceDetail(active) }}</div>
                        </div>
                        <div class="rc-bars" :class="{ paused: !rc.playhead.playing }"><i /><i /><i /></div>
                    </div>
                    <div v-if="controlling" class="rc-volume">
                        <VolumeLowSvg />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            :value="settings.volume"
                            :style="{ backgroundSize: `${volume}% 100%` }"
                            @input="settings.setVolume(parseFloat(($event.target as HTMLInputElement).value))"
                        />
                        <span>{{ volume }}</span>
                    </div>
                </div>
            </template>
            <template v-if="others.length">
                <div class="rc-heading">{{ $t('RemoteControl.OtherDevices') }}</div>
                <button
                    v-for="device in others"
                    :key="device.id"
                    class="rc-device"
                    :class="{ switching: switching === device.id }"
                    :disabled="!!switching"
                    @click="pick(device.id)"
                >
                    <div class="rc-row">
                        <div class="rc-icon"><component :is="deviceIcon(device)" /></div>
                        <div class="rc-text">
                            <div class="rc-name ellip">{{ deviceTitle(device, rc.hostId) }}</div>
                            <div class="rc-detail ellip">
                                <template v-if="switching === device.id">{{ $t('RemoteControl.Connecting') }}</template>
                                <template v-else-if="device.id === rc.hostId">{{ deviceDetail(device) }}</template>
                                <template v-else>{{ deviceDetail(device) }} · {{ $t('RemoteControl.Idle') }}</template>
                            </div>
                        </div>
                        <div v-if="switching === device.id" class="rc-spinner" />
                    </div>
                </button>
            </template>
            <div v-else class="rc-empty">
                <div class="rc-empty-icons"><PhoneSvg /><DesktopSvg /><LaptopSvg /></div>
                <div class="rc-name">{{ $t('RemoteControl.NoOtherDevices') }}</div>
                <div class="rc-detail">{{ $t('RemoteControl.NoOtherDevicesHelp') }}</div>
            </div>
            <div class="rc-footer">
                <span class="ellip">{{ $t('RemoteControl.DevicesOnAccount') }}</span>
                <button @click="settings.toggleRemoteControl()"><UnlinkSvg />{{ $t('RemoteControl.Disconnect') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import UnlinkSvg from '@/assets/icons/unlink.svg'
import VolumeLowSvg from '@/assets/icons/volume-low.svg'
import useQueue from '@/stores/queue'
import useRemote, { getDeviceName } from '@/stores/remote'
import useSettings from '@/stores/settings'
import { DesktopSvg, LaptopSvg, PhoneSvg, deviceDetail, deviceIcon, deviceTitle } from '@/utils/remoteDevices'

const rc = useRemote()
const settings = useSettings()
const queue = useQueue()
const root = ref<HTMLElement | null>(null)
const switching = ref<string | null>(null)

const self = { id: '', name: getDeviceName(), type: 'web', selectable: true }
const volume = computed(() => Math.round(settings.volume * 100))

const active = computed(
    () =>
        (rc.reachable && rc.devices.find(d => d.id === rc.activeHostId)) ||
        rc.devices.find(d => d.id === rc.hostId)
)
const controlling = computed(() => !!active.value && active.value.id !== rc.hostId)
const others = computed(() =>
    rc.devices.filter(d => d.id !== active.value?.id && (d.selectable || d.id === rc.hostId))
)

async function pick(id: string) {
    switching.value = id
    const timeout = setTimeout(() => (switching.value = null), 10000)
    if (!(await rc.transfer(id, true))) switching.value = null
    if (!switching.value) clearTimeout(timeout)
}

watch(
    () => rc.activeHostId,
    id => {
        if (id === switching.value) switching.value = null
    }
)

onClickOutside(root, () => (rc.pickerOpen = false))
</script>

<style lang="scss">
$master-orange: rgb(255, 153, 0);

.rc-devices {
    position: relative;

    > button {
        position: relative;
        display: grid;
        place-items: center;

        svg {
            height: 1.35rem;
            width: 1.35rem;
        }

        &.off {
            opacity: 0.5;
        }

        &.elsewhere {
            color: $master-orange;

            &::after {
                content: '';
                position: absolute;
                top: 0.6rem;
                right: 0.6rem;
                height: 6px;
                width: 6px;
                border-radius: 50%;
                background-color: $master-orange;
            }
        }
    }

    .rc-picker {
        position: absolute;
        bottom: calc(100% + 0.75rem);
        left: -5rem;
        width: 19rem;
        padding: $small;
        background-color: $gray;
        border-radius: 1rem;
        cursor: default;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
        z-index: 10;
        border: solid 0.5px $gray5;

        // keeps the hover alive across the gap to the button
        &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 100%;
            height: 0.75rem;
        }

        &::after {
            content: '';
            position: absolute;
            top: calc(100% - 6px);
            left: calc(5rem + 1.5rem - 6px);
            height: 12px;
            width: 12px;
            background-color: $gray;
            border-right: solid 1px $gray5;
            border-bottom: solid 1px $gray5;
            transform: rotate(45deg);
        }
    }

    &:hover .rc-picker,
    &.open .rc-picker {
        opacity: 1;
        visibility: visible;
    }

    .rc-heading {
        padding: $medium $small $small;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: $gray1;
    }

    .rc-device {
        display: grid;
        justify-content: stretch;
        gap: $small;
        width: 100% !important;
        font-size: inherit !important;
        height: auto !important;
        padding: $small !important;
        border-radius: $medium !important;
        text-align: left;

        &.current,
        &.switching,
        &:hover:not(:disabled) {
            background-color: $gray5 !important;
            border: solid 1px $gray4 !important;
        }

        &:disabled:not(.switching) {
            opacity: 0.5;
        }
    }

    .rc-row {
        display: flex;
        align-items: center;
        gap: $medium;
        min-width: 0;
    }

    .rc-volume {
        display: flex;
        align-items: center;
        gap: $medium;
        padding: $small $smaller 0;
        border-top: solid 1px $gray4;
        color: $gray1;

        svg {
            flex-shrink: 0;
            height: 1.25rem;
            width: 1.25rem;
        }

        input {
            flex: 1;
            margin: 0;
            background: linear-gradient(to top, #ffffff, #ffffff) 0% 50% no-repeat, $gray4;
        }

        span {
            width: 1.75rem;
            text-align: right;
            font-variant-numeric: tabular-nums;
        }
    }

    .rc-spinner {
        flex-shrink: 0;
        height: 1rem;
        width: 1rem;
        margin-right: $small;
        border-radius: 50%;
        border: solid 2px $gray4;
        border-top-color: $master-orange;
        animation: rc-spin 0.8s linear infinite;
    }

    .rc-empty {
        display: grid;
        gap: $small;
        padding: $medium $small;

        .rc-detail {
            line-height: 1.4;
        }
    }

    .rc-offline {
        display: grid;
        gap: $small;
        justify-items: start;
        padding: $medium $small $small;

        .rc-detail {
            line-height: 1.4;
        }

        button {
            margin-top: $small;
            padding: $small $medium;
            border-radius: $small;
            background-color: $gray5;
            font-weight: 600;
        }
    }

    .rc-empty-icons {
        display: flex;
        gap: $medium;
        color: $gray2;

        svg {
            height: 1.35rem;
            width: 1.35rem;
        }
    }

    .rc-icon {
        display: grid;
        place-items: center;
        flex-shrink: 0;
        height: 2.75rem;
        width: 2.75rem;
        border-radius: $small;
        background-color: $gray4;

        svg {
            height: 1.25rem;
            width: 1.25rem;
        }
    }

    .rc-text {
        flex: 1;
        min-width: 0;
    }

    .rc-name {
        font-weight: 600;
    }

    .rc-detail {
        font-size: 0.85rem;
        color: $gray1;
    }

    .rc-bars {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 14px;
        margin-right: $small;

        i {
            width: 3px;
            background-color: $master-orange;
            animation: rc-bars 0.9s ease-in-out infinite alternate;

            &:nth-child(1) {
                height: 60%;
            }

            &:nth-child(2) {
                height: 100%;
                animation-delay: -0.3s;
            }

            &:nth-child(3) {
                height: 35%;
                animation-delay: -0.6s;
            }
        }

        &.paused i {
            animation: none;
        }
    }

    .rc-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $small;
        margin-top: $small;
        padding: $medium $small $smaller;
        border-top: solid 1px $gray5;
        font-size: 0.85rem;
        color: $gray1;

        button {
            display: flex;
            align-items: center;
            gap: $smaller;
            flex-shrink: 0;
            height: auto !important;
            padding: 0 !important;
            background: none !important;
            font-size: inherit !important;
            font-weight: 600;
            color: $white;
        }

        svg {
            height: 1rem;
            width: 1rem;
        }
    }
}

@keyframes rc-spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes rc-bars {
    to {
        height: 20%;
    }
}
</style>
