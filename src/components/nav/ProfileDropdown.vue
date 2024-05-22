<template>
    <div class="profiledrop rounded-sm pad-sm shadow-lg">
        <div class="info item">
            <div class="username">Hi {{ auth.user.firstname || auth.user.username }}</div>
            <div class="description">Some status here?</div>
        </div>
        <div class="separator"></div>
        <div class="item">
            <div class="icon"></div>
            <div class="label">Profile</div>
        </div>
        <div class="item" @click="modal.showSettingsModal">
            <div class="icon"></div>
            <div class="label">Settings</div>
        </div>
        <div class="separator"></div>
        <div class="item critical" @click="auth.logout">
            <div class="icon"></div>
            <div class="label">Logout</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useAuth from "@/stores/auth";
import useModal from "@/stores/modal";

const auth = useAuth();
const modal = useModal();
</script>

<style lang="scss">
.profiledrop {
    position: absolute;
    z-index: 10;
    top: 2.25rem;
    right: 0;
    width: 10rem;
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
        gap: 12px;
        padding: $small $medium;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease-out;

        &:nth-child(3) {
            margin-bottom: $smaller;
        }

        &:hover {
            background-color: $gray4;

            .icon {
                background-color: $white;
            }
        }

        .icon {
            padding: 8px;
            border-radius: 4px;
            background-color: rgb(156, 156, 156);
            transition: background-color 0.2s ease-out;
        }

        .label {
        }
    }

    .info {
        flex-direction: column;
        align-items: baseline;
        gap: $smallest;
        cursor: auto;
        padding: 0.25rem 0.75rem;

        &:hover {
            background-color: transparent;
        }

        .username {
            font-weight: 500;
        }

        .description {
            font-size: 12px;
            color: rgb(156, 156, 156);
        }
    }

    .critical:hover {
        background-color: $red;
    }
}
</style>
