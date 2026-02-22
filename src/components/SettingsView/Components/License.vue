<template>
    <div class="license">
        <form class="rounded" @submit.prevent="registerLicenseKey">
            <!-- <SecretInput placeholder="Paste license key here" button-text="load" @submit="handleLicenseKeyInput"/> -->
            <div class="labelarea">
                <label for="license-key">{{ licenseInfo ? 'Update' : 'Paste' }} license key:</label>
                <div v-if="licenseInfo && licenseInfo.license" class="labels">
                    <div class="label">
                        {{ licenseInfo.license.license_type === 'lifetime' ? 'lifetime license' : 'subscription' }}
                    </div>
                    <div v-if="licenseInfo.license.expires_at" class="label">
                        Expires: {{ new Date(licenseInfo.license.expires_at).toUTCString() }}
                    </div>
                    <div v-if="isExpired" class="label expired">expired</div>
                </div>
            </div>

            <Input
                input-id="license-key"
                :text="licenseInfo?.license_key || ''"
                placeholder="SMX-XXXX-XXXX-XXXX-XXXX-XXXXXXX"
                :show-hide-button="!!licenseInfo?.license_key"
                @input="handleLicenseKeyInput"
            />

            <div>
                <label for="device-name">{{ licenseInfo ? 'Update' : 'New' }} server name:</label>
                <Input
                    input-id="device-name"
                    :text="licenseInfo?.devices.list.find(d => d.current)?.device_name || ''"
                    :placeholder="settings.device_name || ''"
                    @input="(value: string) => deviceName = value"
                />

                <div class="btngroup">
                    <button type="submit" class="btn-active" :disabled="!submitEnabled">
                        <!-- {{ licenseInfo && licenseInfo.license_key !== licenseKey ? 'Update' : 'Activate' }} License -->
                        Save Changes
                    </button>
                    <Spinner v-if="loading" />
                </div>
            </div>
        </form>

        <div v-if="licenseInfo?.license_key" class="licenseinfo">
            <h3 class="h2">Authorized Devices</h3>
            <div class="desc">
                Instances currently using your license key ({{ licenseInfo?.devices.active }}/{{
                    licenseInfo?.devices.limit
                }}
                active)
            </div>
            <div class="license-devices">
                <div
                    v-for="device in [...(licenseInfo?.devices.list || [])].sort(
                        (a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0)
                    )"
                    :key="device.device_id"
                    class="license-device rounded-sm"
                >
                    <div class="icon">
                        <component :is="getDeviceIcon(device.device_type)" />
                    </div>

                    <div>
                        <span class="dname">
                            {{ device.device_name }}
                        </span>
                        <div class="lastseen">{{ getLastSeen(device.last_seen) }}</div>
                    </div>

                    <button class="btnred" @click="logOutDevice(device.device_id)">Revoke</button>
                </div>
            </div>
        </div>

        <div v-if="licenseInfo?.license_key" class="redzone">
            <button class="btnred" @click="logOutDevice(settings.device_id)">Log Out</button>
            <button
                v-if="licenseInfo?.license.license_type === 'subscription'"
                class="btnred"
                @click="cancelSubscription"
            >
                Cancel Subscription
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

import Input from '@/components/shared/Input.vue'
const ServerSvg = defineAsyncComponent(() => import('@/assets/icons/server.svg'))
const LaptopSvg = defineAsyncComponent(() => import('@/assets/icons/laptop.svg'))
const DesktopSvg = defineAsyncComponent(() => import('@/assets/icons/desktop.svg'))
const HandheldSvg = defineAsyncComponent(() => import('@/assets/icons/phone.svg'))
import Spinner from '@/components/shared/Spinner.vue'

import { paths } from '@/config'
import useAxios from '@/requests/useAxios'
import { LicenseInfo } from '@/interfaces'
import useSettingsStore from '@/stores/settings'

TimeAgo.addLocale(en)

const loading = ref(false)
const settings = useSettingsStore()
const licenseKey = ref<string | null>(null)
const deviceName = ref<string | null>(null)
const licenseInfo = ref<LicenseInfo | null>(null)

const submitEnabled = computed(() => {
    // If license has changed
    if (licenseKey.value && licenseKey.value.length === 40 && licenseKey.value !== licenseInfo.value?.license_key) {
        return true
    }

    // If device name has changed
    if (
        deviceName.value &&
        deviceName.value !== (licenseInfo.value?.devices.list.find(d => d.current)?.device_name || settings.device_name)
    ) {
        return true
    }

    if (loading.value) return false
    return false
})

function getDeviceIcon(deviceType: string) {
    switch (deviceType) {
        case 'server':
            return ServerSvg
        case 'laptop':
            return LaptopSvg
        case 'desktop':
            return DesktopSvg
        case 'handheld':
            return HandheldSvg
        default:
            return ServerSvg
    }
}

const isExpired = computed(() => {
    if (!licenseInfo.value?.license?.expires_at) return false
    return new Date(licenseInfo.value.license.expires_at) < new Date()
})

function getLastSeen(date: string | null) {
    if (!date) return 'No activity'

    const timeAgo = new TimeAgo('en').format(new Date(date))
    return `Last activity: ${timeAgo}`
}

function handleLicenseKeyInput(value: string) {
    if (value.length === 40) {
        licenseKey.value = value
    }
}

async function getLicenseInfo() {
    const response = await useAxios({
        url: paths.api.settings.licenseInfo,
        method: 'GET',
    })

    if (response.status === 200) {
        licenseInfo.value = response.data
    }
}

async function registerLicenseKey() {
    const key = licenseKey.value || licenseInfo.value?.license_key || ''
    const serverName = deviceName.value || settings.device_name || ''

    loading.value = true
    const response = await useAxios({
        url: paths.api.settings.licenseRegister,
        props: {
            license_key: key,
            device_name: serverName,
        },
    })

    if (response.status === 200) {
        licenseInfo.value = response.data
        licenseInfo.value!.license_key = key
    }

    loading.value = false
}

async function logOutDevice(deviceId: string) {
    const response = await useAxios({
        url: paths.api.settings.licenseDevice + '/' + deviceId,
        method: 'DELETE',
    })

    if (response.status === 200) {
        const removedId = response.data.revoked.device_id

        // INFO: If we revoked this server, reset license info
        if (removedId === settings.device_id) {
            licenseInfo.value = null
            return
        }

        // INFO: If we revoked another server, update the license info
        licenseInfo.value!.devices.list = licenseInfo.value!.devices.list.filter(d => d.device_id !== removedId)
        licenseInfo.value!.devices.active = response.data.devices.active
        licenseInfo.value!.devices.limit = response.data.devices.limit
    }
}

async function cancelSubscription() {
    window.open('https://polar.sh/swingmx/portal/overview', '_blank')
}

onMounted(async () => {
    await getLicenseInfo()
})
</script>

<style lang="scss">
.license {
    input {
        color: #fff;
        font-family: 'SF Mono', monospace !important;
        font-size: 14px;
        margin-top: $small;
        background-color: $gray;
    }

    .btnred {
        border-radius: $small;
        background-color: transparent;
        // border: solid 0.5px $red;
        color: $red;
        padding: 1.15rem 1rem;

        &:hover {
            background-color: $red;
            color: $white;
        }
    }

    .labelarea {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $small;
    }

    form {
        background-color: $gray5;
        padding: 1rem;
        margin-bottom: 1.25rem;

        button {
            margin-top: $small;
        }
    }

    label {
        color: #ffffff96;
        font-size: 14px;
    }

    $textcolor: $blue;
    $textbgcolor: rgba(32, 102, 164, 0.177);

    .labels {
        display: flex;
        gap: $small;

        .label {
            color: $textcolor;
            background-color: $textbgcolor;
            font-size: 12px;
            font-weight: 500;
            padding: $smallest $smaller;
            outline: solid 1px $gray4;
            border-radius: $smaller;
        }

        .expired {
            color: $red;
            background-color: rgba(176, 18, 18, 0.108);
        }
    }

    .btngroup {
        display: flex;
        align-items: center;
        gap: $small;
    }

    h3 {
        margin-bottom: $smaller;
    }

    .desc {
        margin-bottom: 1rem;
    }

    .license-device {
        display: grid;
        grid-template-columns: 3rem 1fr max-content;
        margin-top: $small;
        align-items: center;
        gap: 1rem;
        padding: $medium;

        border: solid 1px $gray5;
        border-radius: $medium;

        .icon {
            width: 3rem;
            aspect-ratio: 1;
            background-color: $gray5;
            border-radius: $small;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lastseen {
            font-size: 14px;
            opacity: 0.6;
            margin-top: 2px;
        }

        svg {
            width: 1.5rem;
            height: 1.5rem;
            color: $gray1;
        }

        .dname {
            font-weight: 600;
        }
    }

    .license-device:first-child {
        $accent: $gray1;
        // border-color: $accent;

        .icon {
            background-color: $textbgcolor;
        }

        svg {
            color: $textcolor;
        }

        .dname {
            display: flex;
            align-items: center;
        }

        .dname::after {
            content: 'THIS HOST';
            background-color: $textbgcolor;
            font-size: 10px;
            font-weight: 500;
            margin-left: $small;
            color: $textcolor;
            padding: $smallest $smaller;
            border-radius: $smaller;
        }
    }

    .redzone {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: $small;
        margin-top: 2rem;
        padding: 0 $medium;

        button {
            border: solid 0.5px $red;
            color: $red;
        }

        button:hover {
            border-color: $red;
        }
    }
}
</style>
