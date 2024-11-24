<template>
    <div class="folder-view v-scroll-page" style="height: 100%" :class="{ isSmall, isMedium }">
        <DynamicScroller
            id="contentscroller"
            :items="scrollerItems"
            :min-item-size="64"
            class="scroller"
            style="height: 100%"
        >
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[item.props]"
                    :data-index="index"
                >
                    <component
                        :is="item.component"
                        :key="index"
                        v-bind="item.props"
                        @playThis="playFromPlaylistPage(item.props.index - 1)"
                    ></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onMounted, onUpdated } from 'vue'

import { isMedium, isSmall, isSmallPhone, track_limit } from '@/stores/content-width'
import { dropSources } from '@/enums'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import usePlaylistStore from '@/stores/pages/playlist'

import updatePageTitle from '@/utils/updatePageTitle'

import playlistSvg from '@/assets/icons/playlist.svg'
import Header from '@/components/PlaylistView/Header.vue'
import NoItems from '@/components/shared/NoItems.vue'
import SongItem from '@/components/shared/SongItem.vue'
import AfterHeader from '@/components/PlaylistView/AfterHeader.vue'
import { onBeforeRouteLeave } from 'vue-router'
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'

const queue = useQueue()
const tracklist = useTracklist()
const playlist = usePlaylistStore()

interface ScrollerItem {
    id: string | number
    component: typeof Header | typeof SongItem | typeof NoItems | typeof AlbumsFetcher
    size: number
    props?: {}
}

const getNoItemsComponent = () =>
    <ScrollerItem>{
        id: 'Noitems',
        component: NoItems,
        size: 300, // somehow it doesn't work, patched with CSS
        props: {
            icon: playlistSvg,
            flag: playlist.tracks.length === 0,
            title: 'No tracks in this playlist',
            description: 'Add tracks to this playlist by right clicking on a track and selecting "add to playlist"',
        },
    }

const scrollerItems = computed(() => {
    const header: ScrollerItem = {
        id: 'header',
        component: Header,
        size: isSmallPhone.value ? 24 * 16 : 18 * 16,
    }

    const afterHeader: ScrollerItem = {
        id: 'afterHeader',
        component: AfterHeader,
        size: 4 * 16,
    }

    const tracks = playlist.tracks.map(track => {
        return {
            id: track.filepath,
            component: SongItem,
            props: {
                track: track,
                index: track.index + 1,
                is_last: track.index === playlist.tracks.length - 1,
                droppable: true,
                source: dropSources.playlist,
            },
            size: 64,
        }
    })

    const body = playlist.tracks.length === 0 ? [getNoItemsComponent()] : tracks

    if (playlist.tracks.length >= track_limit.value) {
        body.push({
            id: Math.random(),
            size: 1,
            component: AlbumsFetcher,
            props: {
                fetch_callback: () => playlist.fetchAll(playlist.info.id),
            },
        })
    }

    return [header, afterHeader, ...body]
})

async function playFromPlaylistPage(index: number) {
    const { name, id } = playlist.info

    if (playlist.tracks.length !== playlist.info.count) {
        // fetch all the tracks
        playlist.fetchAll(id, false, true)
    }

    tracklist.setFromPlaylist(name, id, playlist.allTracks)
    queue.play(index)
}

;[onMounted, onUpdated].forEach(() => {
    updatePageTitle(playlist.info.name)
})

onBeforeRouteLeave(() => playlist.resetAll())
</script>

<style lang="scss">
.playlist-virtual-scroller {
    .nothing {
        height: 25rem;
    }
}
</style>
