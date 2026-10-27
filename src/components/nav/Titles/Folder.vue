<template>
    <div id="folder-nav-title">
        <div class="fname">
            <div
                class="icon"
                :title="$t('LeftSidebar.NavItems.Home')"
                @click="
                    $router.push({
                        name: Routes.folder,
                        params: { path: '$home' },
                    })
                "
            >
                <HomeSvg />
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

import HomeSvg from '@/assets/icons/home.svg'
import BreadCrumbNav from '@/components/FolderView/BreadCrumbNav.vue'
import DropDown from '@/components/shared/DropDown.vue'
import useFolder from '@/stores/pages/folder'
import { computed } from 'vue'
import { useT } from '@/i18n'


const { t } = useT();

const router = useRouter()
const folder = useFolder()

function navigate(path: string) {
    router.push({ name: Routes.folder, params: { path } })
}

interface SortItem {
    key: string
    title: string
}

const items: SortItem[] = [
    { key: 'default', title: t('Common.Default') },
    { key: 'title', title: t('Common.Title') },
    { key: 'filepath', title: t('Common.FileName') },
    { key: 'album', title:  t('Common.Album') },
    // { key: 'albumartists', title: t('Common.AlbumArtist')} },
    { key: 'artists', title: t('Common.Artist', 2) },
    // { key: 'bitrate', title: t('Common.Bitrate') },
    { key: 'date', title: t('Common.ReleaseDate') },
    // { key: 'disc', title: t('Common.Disc') },
    // { key: 'duration', title: t('Common.Duration') },
    { key: 'last_mod', title: t('Common.DateAdded') },
    { key: 'lastplayed', title: t('Common.LastPlayed') },
    { key: 'playcount', title: t('Common.PlayCount') },
    { key: 'playduration', title: t('Common.PlayDuration') },
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
        background-color: $gray5;
        border-radius: $small;
        height: 2.188rem;
        display: flex;
        align-items: center;
        max-width: 100%;
        overflow: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;

        // hovers like the breadcrumb pieces
        .icon {
            aspect-ratio: 1;
            margin: 0 $smaller;
            padding: $smaller;
            display: flex;
            border-radius: $smaller;
            cursor: pointer;
            transition: background-color 0.2s ease-out;

            &:hover {
                background-color: $gray;
            }

            svg {
                height: 1.25rem;
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
