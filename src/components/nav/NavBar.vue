<template>
    <div
        class="topnav"
        :class="{
            use_links: settings.is_alt_layout,
            use_sidebar: settings.use_sidebar && isSmall,
        }"
    >
        <div class="left">
            <NavButtons />
            <NavLinks v-if="settings.is_alt_layout" />
            <div v-if="settings.is_default_layout && $route.name == Routes.folder" class="info">
                <Folder />
            </div>
            <NavTitles v-else-if="settings.is_default_layout && !isSmall" />
        </div>
        <div class="sidenav_toggle" @click="toggleSidenav">
            <div class="bar"></div>
            <div class="bar"></div>
        </div>
        <NavSidenav @close="toggleSidenav" :class="{ active: sidenavActive }" />
        <div class="dimmer noSelect" :class="{ active: sidenavActive }" @click="toggleSidenav"></div>
        <RouterLink v-if="settings.is_alt_layout" to="/" class="logo rounded-sm"><LogoSvg /></RouterLink>
        <div v-if="settings.is_alt_layout || !settings.use_sidebar || !xl" class="right">
            <SearchInput :on_nav="true" />
            <!-- v-if="settings.is_alt_layout" -->
            <div class="avatar">
                <div class="img circular">
                    <Avatar :name="auth.user.username || ''" :size="36" />
                </div>
                <ProfileDropdown />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Routes } from '@/router'
import { computed, ref } from 'vue'

import useAuth from '@/stores/auth'
import { content_width } from '@/stores/content-width'
import useSettings from '@/stores/settings'
import { xl } from './../../composables/useBreakpoints'

import LogoSvg from '@/assets/icons/logos/logo-fill.light.svg'
import SearchInput from '../RightSideBar/SearchInput.vue'
import Avatar from '../shared/Avatar.vue'
import NavButtons from './NavButtons.vue'
import NavLinks from './NavLinks.vue'
import NavSidenav from './NavSidenav.vue'
import NavTitles from './NavTitles.vue'
import ProfileDropdown from './ProfileDropdown.vue'
import Folder from './Titles/Folder.vue'

const auth = useAuth()
const settings = useSettings()
const isSmall = computed(() => content_width.value < 800)

const sidenavActive = ref(false)

function toggleSidenav() {
    sidenavActive.value = !sidenavActive.value
}
</script>

<style lang="scss">
.topnav {
    display: grid;
    grid-template-columns: 1fr max-content;

    input {
        min-width: 6rem;
    }

    align-items: center;
    gap: 1rem;
    font-size: 14px;

    &.use_links {
        grid-template-columns: 1fr max-content 1fr;
    }

    .left {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 1rem;

        .info {
            margin: auto 0;
            width: fit-content;
            overflow: hidden;

            .title {
                font-size: 1.5rem;
                font-weight: 700;
                display: flex;
                align-items: center;
            }
        }

        @include allPhones {
            display: none;
        }
    }

    .logo {
        width: max-content;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .right {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        align-items: center;
        width: 100%;

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

        @include allPhones {
            gap: unset;
            justify-content: unset;
        }
    }

    @include allPhones {
        display: flex;
    }
}
</style>
