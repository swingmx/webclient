<template>
    <div class="license">
        <div
            v-if="!licenseInfo || licenseInfo?.license.license_type === 'gh_sponsor'"
            class="github rounded"
            :class="{ success: licenseInfo && licenseInfo.license.license_type === 'gh_sponsor' }"
        >
            <div class="info">
                <div class="header">
                    <b
                        ><span v-if="!licenseInfo">GitHub Sponsor Benefits</span
                        ><span v-else>Thank you for sponsoring Swing Music!</span></b
                    >
                </div>
                <div class="desc">
                    <span v-if="!licenseInfo">
                        Swing Music Premium is available to all our GitHub Sponsors. Log in with GitHub to get access.
                    </span>
                    <span v-else>
                        Hello @{{ licenseInfo.customer.name }}! You have access to Swing Music Premium. <br />
                        Thank you for your support. ❤️❤️</span
                    >

                    <!-- <br /><br /> -->
                </div>
                <br v-if="!licenseInfo" />
                <div v-if="!licenseInfo" class="btns">
                    <button @click="loginWithGitHub">{{ loginWithGitHubText }}</button>
                    <a
                        v-if="loginWithGitHubText === 'Log in with GitHub'"
                        href="https://github.com/sponsors/swingmx"
                        target="_blank"
                    >
                        <button>Sponsor on GitHub ❤️</button>
                    </a>
                </div>
            </div>
            <GHSponsorSvg class="sponsor_icon" />
        </div>

        <div v-if="!licenseInfo?.license" class="infocard rounded">
            <div class="header"><span>No Active Subscription</span><CrownSvg /></div>
            <div class="content">
                Get a subscription to unlock all premium features. Use the link below to browse the available plans and
                benefits.
            </div>
            <div class="footer">
                <a href="https://swingmx.com/pricing" target="_blank" class="cta rounded-sm">View Pricing</a>
            </div>
        </div>

        <form
            v-if="licenseInfo?.license.license_type !== 'gh_sponsor'"
            class="rounded"
            @submit.prevent="registerLicenseKey"
        >
            <div class="header">{{ licenseInfo?.license_key ? 'License key info' : 'Already got a license key?' }}</div>
            <label for="license-key">{{
                licenseInfo?.license_key ? 'Update your license key:' : 'Paste your license key here:'
            }}</label>
            <Input
                input-id="license-key"
                :text="licenseInfo?.license_key || ''"
                placeholder="..."
                :show-hide-button="true"
                @input="handleLicenseKeyInput"
            />

            <div>
                <label for="device-name">{{ licenseInfo ? 'Update' : 'New' }} server name:</label>
                <Input
                    input-id="device-name"
                    :text="licenseInfo?.devices.list?.find(d => d.current)?.device_name || ''"
                    :placeholder="settings.device_name || ''"
                    @input="(value: string) => (deviceName = value)"
                />

                <div v-if="submitEnabled" class="btngroup">
                    <button type="submit" class="btn-active" :disabled="!submitEnabled">
                        <!-- {{ licenseInfo && licenseInfo.license_key !== licenseKey ? 'Update' : 'Activate' }} License -->
                        Save Changes
                    </button>
                    <Spinner v-if="loading" />
                </div>
            </div>
        </form>

        <div v-if="error" class="errors rounded-sm">
            <div class="error-icon">
                <ErrorSvg />
            </div>
            <div class="error-text">
                {{ error }}
            </div>
        </div>

        <div v-if="licenseInfo?.license.subscription" class="licenseMeta rounded">
            <h3 class="h2">
                {{ `${licenseInfo.license.license_type === 'gh_sponsor' ? 'GitHub Sponsors' : 'Subscription'}` }}
                Details
            </h3>
            <div class="content">
                <div class="info">
                    <div class="label">
                        {{ `${licenseInfo.license.license_type === 'gh_sponsor' ? 'Tier' : `Amount`}` }}
                    </div>
                    <span class="primary">
                        ${{
                            licenseInfo?.license.subscription.amount != null
                                ? (licenseInfo.license.subscription.amount / 100).toFixed(2)
                                : ''
                        }} </span
                    ><span class="period"
                        >/{{ getRecurringInterval(licenseInfo?.license.subscription.recurring_interval || '') }}</span
                    >
                </div>
                <div class="info">
                    <div class="label">Status</div>
                    <span class="primary">
                        {{ licenseInfo?.license.subscription.status }}
                    </span>
                    <span v-if="licenseInfo?.license.subscription.canceled_at" class="red">
                        <br />
                        {{
                            licenseInfo?.license.subscription.canceled_at
                                ? 'CANCELLED ' + getTimeAgo(licenseInfo.license.subscription.canceled_at).toUpperCase()
                                : ''
                        }}
                    </span>
                </div>
                <div class="info">
                    <div class="label">Renewal</div>
                    <span class="primary renewal">
                        {{
                            licenseInfo?.license.subscription.cancel_at_period_end
                                ? 'Auto-renew off'
                                : getDate(licenseInfo?.license.subscription.current_period_end || '')
                        }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="licenseInfo?.license.device_id" class="licenseinfo">
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

                    <button class="btnred" @click="() => logOutDevice(device.device_id)">Revoke</button>
                </div>
            </div>
        </div>

        <div v-if="licenseInfo?.license.device_id" class="redzone">
            <a
                v-if="licenseInfo?.license.license_type !== 'lifetime'"
                class="submanage"
                :href="
                    licenseInfo?.license.license_type === 'gh_sponsor'
                        ? 'https://github.com/sponsors/swingmx'
                        : 'https://polar.sh/swingmx/portal/overview'
                "
                target="_blank"
            >
                Manage {{ licenseInfo?.license.license_type === 'gh_sponsor' ? 'Sponsorship' : 'Subscription' }} ↗
            </a>
            <button class="btnred" @click="() => logOutDevice(settings.device_id)">Log Out</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

import Input from '@/components/shared/Input.vue'
import Spinner from '@/components/shared/Spinner.vue'
import ErrorSvg from '@/assets/icons/toast/error.svg'

const CrownSvg = defineAsyncComponent(() => import('@/assets/icons/crown.svg'))
const ServerSvg = defineAsyncComponent(() => import('@/assets/icons/server.svg'))
const LaptopSvg = defineAsyncComponent(() => import('@/assets/icons/laptop.svg'))
const DesktopSvg = defineAsyncComponent(() => import('@/assets/icons/desktop.svg'))
const HandheldSvg = defineAsyncComponent(() => import('@/assets/icons/phone.svg'))
const GHSponsorSvg = defineAsyncComponent(() => import('@/assets/icons/gh_sponsors.svg'))

import { paths } from '@/config'
import useAxios from '@/requests/useAxios'
import { LicenseInfo } from '@/interfaces'
import useSettingsStore from '@/stores/settings'
import { storeToRefs } from 'pinia'

TimeAgo.addLocale(en)

const error = ref<string | null>(null)
const loading = ref(false)
const settings = useSettingsStore()
const licenseKey = ref<string | null>(null)
const deviceName = ref<string | null>(null)
const licenseInfo = storeToRefs(useSettingsStore()).licenseInfo
const loginWithGitHubText = ref<string>('Log in with GitHub')

const submitEnabled = computed(() => {
    // If license has changed
    if (licenseKey.value && licenseKey.value.length === 40 && licenseKey.value !== licenseInfo.value?.license_key) {
        return true
    }

    // If device name has changed
    if (
        deviceName.value &&
        deviceName.value !== (licenseInfo.value?.devices.list?.find(d => d.current)?.device_name || settings.device_name)
    ) {
        return true
    }

    if (loading.value) return false
    return false
})

function getRecurringInterval(interval: string) {
    switch (interval) {
        case 'month':
            return 'mo'
        case 'year':
            return 'yr'
    }

    return interval
}

function getDate(date: string) {
    const s = new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
    const [day, month, year] = s.split(' ')
    return `${day} ${month}, ${year}`
}

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

function getTimeAgo(date: string) {
    return new TimeAgo('en').format(new Date(date))
}

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

async function getLicenseInfo(checkSponsor: boolean = false) {
    const response = await useAxios({
        url: paths.api.settings.licenseInfo + '?github_sponsors=' + checkSponsor,
        method: 'GET',
    })

    if (response.status === 200) {
        settings.updateLicenseInfo(response.data)
    }
}

async function registerLicenseKey() {
    error.value = null
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
        const info = response.data as LicenseInfo
        info.license_key = key
        settings.updateLicenseInfo(info)
    }

    if (response.status !== 200) {
        error.value = response.data?.error || 'An unknown error occurred'
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
            settings.updateLicenseInfo(null)
            return
        }

        // INFO: If we revoked another server, update the license info
        const info = licenseInfo.value as LicenseInfo
        info.devices.list = info.devices.list.filter(d => d.device_id !== removedId)
        info.devices.active = response.data.devices.active
        info.devices.limit = response.data.devices.limit
        settings.updateLicenseInfo(info)
    }

    return
}

async function loginWithGitHub() {
    if (loginWithGitHubText.value === 'Refresh Status') {
        return await getLicenseInfo(true).then(() => {
            loginWithGitHubText.value = 'Log in with GitHub'
        })
    }

    const clientId = 'Ov23li5bsrEqMmqdT10i'
    const publicKey = settings.public_key
    const redirectUri = 'http://localhost:1957/auth/github/callback'
    // const redirectUri = 'https://cloud.swingmx.com/auth/github/callback'
    const githubUrl = `https://github.com/login/oauth/authorize`

    const queryParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        state: `${publicKey}:${settings.device_id}:${settings.device_name}`,
    })

    const url = `${githubUrl}?${queryParams.toString()}`
    window.open(url, '_blank')

    loginWithGitHubText.value = 'Refresh Status'
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
        background-color: transparent;
        border: solid 1px $gray2;
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
        background-color: #222427;
        // background: linear-gradient(35deg, rgba(30, 35, 45, 0.429), rgba(54, 62, 80, 0.288), rgba(36, 47, 73, 0.144));
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
        align-items: center;
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

    .errors {
        display: flex;
        align-items: center;
        padding: 1rem;
        border: solid 1px $red;
        color: $red;
        gap: $small;
        font-size: 14px;

        svg {
            height: 1.5rem;
        }
    }

    .licenseMeta {
        background-color: #2323299c;
        // border: solid 0.5px rgba(240, 246, 252, 0.261);
        padding: 1rem;
        margin-bottom: 1.25rem;

        .info {
            margin: 0;
        }

        .h2 {
            margin-top: 0;
            text-transform: uppercase;
            font-size: 14px;
            color: $gray1;
            margin-bottom: 1rem;
        }

        .content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: unset;
            padding-bottom: $small;
        }

        .label {
            font-size: 12px;
            font-weight: 500;
            color: $gray1;
            margin-bottom: $smallest;
        }

        .primary {
            font-size: 16px;
            font-weight: 800;
            color: #fff;
            text-transform: capitalize;
        }

        .period {
            font-size: 12px;
            font-weight: 500;
            color: $gray1;
        }

        .red {
            color: $red;
            font-size: 11px;
            font-weight: 500;
            margin-top: $smallest;
        }

        .renewal {
            display: flex;
            align-items: center;
            gap: $small;
            text-transform: none;
        }

        svg {
            width: 1rem;
            height: 1rem;
            color: $red;
        }
    }

    .submanage {
        color: $white;
        font-size: 14px;
        font-weight: 500;
        color: $blue;
        margin-top: $smallest;

        &:hover {
            text-decoration: underline;
        }
    }

    .header {
        font-size: 1.15rem;
        font-weight: 700;
        color: $white;
        margin-bottom: 2px;

        display: flex;
        align-items: center;
        gap: $small;

        svg {
            width: 1.25rem;
        }
    }

    .infocard {
        background: linear-gradient(35deg, rgba(41, 49, 69, 0.429), rgba(33, 42, 50, 0.367), rgba(25, 30, 35, 0.369));
        padding: 2rem;
        margin-bottom: 1.25rem;

        .content {
            display: block;
            font-size: 14px !important;
            font-size: 1.05rem;
            color: $white;
            margin-bottom: 1.5rem !important;
            max-width: 90%;
        }

        .footer {
            margin-top: $small;
        }

        .cta {
            border: solid 1px $white;
            color: $white;
            padding: $small $medium;
            font-weight: 500;
            padding: $small 1.5rem;
            font-size: 14px;
        }

        // .icon {
        //     width: 2rem;
        //     // position: absolute;
        //     top: 1.75rem;
        //     right: 1.75rem;
        // }
    }

    .github {
        display: grid;
        grid-template-columns: 1fr max-content max-content;
        gap: 1rem;
        align-items: center;

        background-color: #0d74e7;
        border: solid 0.5px rgba(255, 255, 255, 0.1);
        position: relative;
        padding: 1rem;
        margin-bottom: 1.25rem;

        &.success {
            padding: 1rem;

            .sponsor_icon {
                width: 4rem;
            }
        }

        .info {
            .desc {
                color: white;
                opacity: 0.75;
                margin-bottom: 0;
                font-size: 14px;
            }

            margin-bottom: 0;
        }

        .sponsor_icon {
            width: 6rem;
        }

        .btns {
            display: flex;
            flex-wrap: wrap;
            gap: $small;
            justify-content: space-between;
        }

        button {
            background-color: $white;
            color: $black;
        }
    }
}
</style>
