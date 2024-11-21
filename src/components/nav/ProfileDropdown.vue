<template>
    <div class="profiledrop rounded-md pad-sm shadow-lg noSelect">
        <div class="info item">
            <div class="username ellip2">Hi {{ auth.user.firstname || auth.user.username }}</div>
        </div>
        <div class="separator"></div>
        <div class="item scan" @click="triggerScan">
            <div class="label">Quick scan</div>
            <ReloadSvg />
        </div>
        <div class="item" @click="modal.showSettingsModal">
            <div class="label">Settings</div>
            <SettingsSvg />
        </div>
        <div class="separator"></div>
        <div class="item critical logout" @click="auth.logout">
            <div class="label">Log out</div>
            <LogoutSvg />
        </div>
    </div>
</template>

<script setup lang="ts">
import useAuth from '@/stores/auth'
import useModal from '@/stores/modal'

import LogoutSvg from '@/assets/icons/logout.svg'
import ReloadSvg from '@/assets/icons/reload.svg'
import SettingsSvg from '@/assets/icons/settings.svg'
import { triggerScan } from '@/requests/settings/rootdirs'

const auth = useAuth()
const modal = useModal()
</script>

<style lang="scss">
.profiledrop {
    position: absolute;

    z-index: 9999;
    top: 2.25rem;
    right: 0;
    width: 10.25rem;
    font-size: 0.95rem;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    border: solid 1px $gray5;
    background-color: $gray;

    .separator {
        height: 1px;
        background-color: $gray3;
        padding: 0;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $smaller;
        padding: $small $medium;
        padding-right: $small;
        max-height: 36px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease-out, opacity 0.2s ease-out, box-shadow 0.2s ease-out;

        &:hover {
            background-color: $gray4;
        }

        &:active {
            opacity: 0.3;
        }

        svg {
            display: block;
            height: 1.5rem;
        }
    }

    .item.scan {
        margin-bottom: $smaller;
    }

    .item.logout svg,
    .scan svg {
        // INFO: Though the icons are 1.5rem, it looks larger than the rest
        // So, we reduce the size a bit.
        height: 1.25rem;
    }

    .logout svg {
        margin-right: 1px;
    }

    .scan svg {
        margin-right: 3px;
    }

    .info {
        gap: $small;
        cursor: auto;
        padding: $smaller $medium;

        &:hover {
            background-color: transparent;
        }

        > .username {
            font-weight: 500;
        }
    }

    .info.item {
        max-height: unset;
        opacity: unset;
        pointer-events: none;
    }

    .critical {
        color: $red;
    }

    .critical:hover {
        background-color: transparent;
        box-shadow: 0 0 0 1px $red;
    }
}
</style>
