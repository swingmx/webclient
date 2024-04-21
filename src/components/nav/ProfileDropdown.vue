<template>
    <div class="profiledrop rounded-sm pad-sm shadow-lg">
        <div class="info item">
            Hi {{ auth.user.firstname || auth.user.username }}
        </div>
        <div class="separator"></div>
        <div class="item">Profile</div>
        <div class="item">Settings</div>
        <div class="separator"></div>
        <div class="item critical" @click="auth.logout">Logout</div>
    </div>
</template>

<script setup lang="ts">
import useAuth from '@/stores/auth'

const auth = useAuth()
</script>

<style lang="scss">
.profiledrop {
    position: absolute;
    background-color: $gray;
    top: 2.25rem;
    width: 10rem;
    right: 0;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    border: solid 1px $gray5;
    z-index: 10;

    .separator {
        height: 1px;
        background-color: $gray3;
        padding: 0;
    }

    .item {
        padding: $small;
        border-radius: $smaller;
        cursor: pointer !important;

        &:hover {
            background-color: $gray4;
        }
    }

    .info {
        pointer-events: none;
    }

    .critical:hover {
        background-color: $red;
    }
}
</style>
