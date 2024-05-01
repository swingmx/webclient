<template>
    <div id="folder-nav-title">
        <div class="fname">
            <div
                class="icon image"
                @click="
                    $router.push({
                        name: Routes.folder,
                        params: { path: '$home' },
                    })
                "
            >
                <FolderSvg />
            </div>
            <BreadCrumbNav
                :sub-paths="subPaths"
                @navigate="navigate"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { subPath } from '@/interfaces'
import { Routes } from '@/router'

import BreadCrumbNav from '@/components/FolderView/BreadCrumbNav.vue'
import FolderSvg from '@/assets/icons/folder.svg'

const router = useRouter()

defineProps<{
    subPaths: subPath[]
}>()

function navigate(path: string) {
    router.push({ name: Routes.folder, params: { path } })
}
</script>

<style lang="scss">
#folder-nav-title {
    width: 100%;
    display: grid;
    overflow: hidden;

    .fname {
        background-color: $gray4;
        border-radius: $small;
        height: 2.188rem;
        display: flex;
        align-items: center;
        width: fit-content;
        max-width: 100%;
        overflow: scroll;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        .icon {
            aspect-ratio: 1;
            margin: $small;
            display: flex;

            svg {
                height: 1.5rem;
            }
        }
    }
}
</style>
