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
            <BreadCrumbNav @navigate="navigate" />
        </div>
        <DropDown
            :items="items"
            :current="current"
            component_key="sortbar"
            :reverse="folder.trackSortReverse"
            @item-clicked="handleSortKeySet"
        />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Routes } from '@/router'

import FolderSvg from '@/assets/icons/folder.svg'
import BreadCrumbNav from '@/components/FolderView/BreadCrumbNav.vue'
import DropDown from '@/components/shared/DropDown.vue'
import useFolder from '@/stores/pages/folder'
import { computed } from 'vue'

const router = useRouter()
const folder = useFolder()

function navigate(path: string) {
    router.push({ name: Routes.folder, params: { path } })
}

interface SortItem {
    key: string;
    title: string;
}

const items: SortItem[] = [
    { key: 'default', title: 'Default' },
    { key: 'title', title: 'Title' },
    { key: 'album', title: 'Album' },
    // { key: 'albumartists', title: 'Album Artist' },
    { key: 'artists', title: 'Artist' },
    // { key: 'bitrate', title: 'Bitrate' },
    { key: 'date', title: 'Release Date' },
    // { key: 'disc', title: 'Disc' },
    // { key: 'duration', title: 'Duration' },
    { key: 'last_mod', title: 'Date Added' },
    { key: 'lastplayed', title: 'Last Played' },
    { key: 'playcount', title: 'Play Count' },
    { key: 'playduration', title: 'Play Duration' },
]

const handleSortKeySet = (item: SortItem) => {
    folder.setFolderTrackSortKey(item.key)
}

const current = computed(() => {
    return items.find(item => item.key === folder.trackSortBy) || items[0]
})
</script>

<style lang="scss">
// .info > #folder-nav-title {
//   display: grid;
// }

// .is_alt_layout #folder-nav-title {
//   display: grid;
// }

#folder-nav-title {
    width: fit-content;
    // overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    // gap: 1rem;
    justify-content: space-between;
    // width: 100%;
    margin-right: 10rem; // sortbar width

    @include allPhones {
        display: grid;
        padding-top: $medium;
        padding-bottom: 1rem;

        // INFO: Folder page sort bar overrides
        .sortbar {
            top: $medium !important;
            right: 1rem !important;
        }
    }

    .sortbar {
        position: absolute;
        top: 1rem;
        right: 0;
        width: 9rem;
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
