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
            <div
                v-if="
                    settings.is_default_layout && $route.name == Routes.folder
                "
                class="info"
            >
                <Folder :sub-paths="subPaths" />
            </div>
            <NavTitles v-else-if="settings.is_default_layout && !isSmall" />
        </div>
        <RouterLink
            v-if="settings.is_alt_layout"
            to="/"
            class="logo rounded-sm"
            ><LogoSvg
        /></RouterLink>
        <div
            v-if="settings.is_alt_layout || !settings.use_sidebar"
            class="right"
        >
            <SearchInput :on_nav="true" />
            <div class="avatar">
                <RouterLink
                    :to="{
                        name: Routes.settings,
                        params: {
                            tab: 'general',
                        },
                    }"
                    class="img circular"
                >
                    <Avatar
                        :name="auth.user.username || ''"
                        :size="36"
                    />
                </RouterLink>
                <ProfileDropdown />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Routes } from '@/router'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { subPath } from '@/interfaces'
import { content_width } from '@/stores/content-width'
import useSettings from '@/stores/settings'
import { createSubPaths } from '@/utils'
import useAuth from '@/stores/auth'

import LogoSvg from '@/assets/icons/logos/logo-fill.light.svg'
import SearchInput from '../RightSideBar/SearchInput.vue'
import NavButtons from './NavButtons.vue'
import NavLinks from './NavLinks.vue'
import NavTitles from './NavTitles.vue'
import Avatar from '../shared/Avatar.vue'
import Folder from './Titles/Folder.vue'
import ProfileDropdown from './ProfileDropdown.vue'

const auth = useAuth()
const settings = useSettings()
const isSmall = computed(() => content_width.value < 800)

const route = useRoute()
const subPaths = ref<subPath[]>([])

let oldpath = ''

watch(
    () => route.name,
    (newRoute) => {
        switch (newRoute) {
            case Routes.folder: {
                ;[oldpath, subPaths.value] = createSubPaths(
                    route.params.path as string,
                    oldpath
                )

                watch(
                    () => route.params.path,
                    (newPath) => {
                        newPath = newPath as string
                        if (newPath == undefined) return
                        ;[oldpath, subPaths.value] = createSubPaths(
                            newPath,
                            oldpath
                        )
                    }
                )
                break
            }
            default:
                break
        }
    }
)

onMounted(() => {
    if (route.name == Routes.folder) {
        ;[oldpath, subPaths.value] = createSubPaths(
            route.params.path as string,
            oldpath
        )
    }
})
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

    &.use_sidebar {
        gap: 0;
    }

    .left {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 1rem;

        .info {
            margin: auto 0;

            .title {
                font-size: 1.5rem;
                font-weight: bold;
                display: flex;
                align-items: center;
            }
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
                    transition: all .75s ease-out;
                }

                &:hover {
                    &::after {
                        background-color: $brown;
                    }
                }
            }

            .profiledrop {
                opacity: 0;
                transform: translateY(0.5rem);
                transition: all 0.25s ease-out;
                visibility: hidden;
                transition-delay: 0.35s;
            }

            &:hover {
                .profiledrop {
                    visibility: visible;
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.15s;
                }
            }
        }
    }
}
</style>
