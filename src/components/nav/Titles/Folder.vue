<template>
    <div id="folder-nav-title">
        <div class="fname">
            <div
                class="icon"
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
                @navigate="navigate"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Routes } from '@/router'

import BreadCrumbNav from '@/components/FolderView/BreadCrumbNav.vue'
import FolderSvg from '@/assets/icons/folder.svg'

const router = useRouter()


function navigate(path: string) {
    router.push({ name: Routes.folder, params: { path } })
}
</script>

<style lang="scss">
.info > #folder-nav-title {
  display: grid;
}

.is_alt_layout #folder-nav-title {
  display: grid;
}

#folder-nav-title {
  width: fit-content;
  overflow: hidden;
  display: none;

  @include allPhones {
    display: grid;
    padding-top: $medium;
    padding-bottom: 1rem;
  }

  .fname {
    background-color: $gray4;
    border-radius: $small;
    height: 2.188rem;
    display: flex;
    align-items: center;
    max-width: 100%;
    overflow: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;

    .icon {
            aspect-ratio: 1;
            margin: 0 $small;
            display: flex;

            svg {
                height: 1.5rem;
            }
        }
  }
}

.fname {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
