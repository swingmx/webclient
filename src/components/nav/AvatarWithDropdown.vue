<template>
    <div class="avatar">
        <div class="img circular">
            <Avatar :name="auth.user.username || ''" :size="36" />
        </div>
        <ProfileDropdown />
    </div>
</template>

<script setup lang="ts">
import useAuth from '@/stores/auth';
const auth = useAuth()

import Avatar from '../shared/Avatar.vue';
import ProfileDropdown from './ProfileDropdown.vue';
</script>

<style lang="scss">
.avatar {
    position: relative;
    aspect-ratio: 1;
    cursor: pointer;
    transition: background-color 0.2s ease-out, color 0.2s ease-out;

    display: grid;
    place-items: center;
    border-radius: 40%;

    .img {
        height: 36px;

        &::after {
            content: '';
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #00000000;
            border-radius: 5rem;
            transition: all 0.75s ease-out;
        }

        &:hover {
            &::after {
                background-color: $brown;
            }
        }
    }

    .profiledrop {
        opacity: 0;
        visibility: hidden;
        transform: translateY(0.5rem);
        transition: opacity 0.2s ease-out, visibility 0.2s ease-out, transform 0.2s ease-out;
    }

    &:hover {
        .profiledrop {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    }

    @include allPhones {
        height: unset;
        background-color: transparent;
    }
}
</style>
