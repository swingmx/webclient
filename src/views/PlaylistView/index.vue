<template>
    <div class="folder-view v-scroll-page" style="height: 100%" :class="{ isSmall, isMedium }">
        <VirtualList
            id="contentscroller"
            :model-value="scrollerItems"
            data-key="id"
            :size="64"
            class="scroller vue-recycle-scroller"
            style="height: 100%"
            draggable=".playlist-track"
            lock-axis="x"
            append-to-body
            :class="{ dragging }"
            ghost-class="playlist-drag-ghost"
            placeholder-class="playlist-drag-placeholder"
            :ghost-style="{ opacity: '1' }"
            @drag="dragging = true"
            @drop="onDrop"
        >
            <template #item="{ item }">
                <div :class="{ 'playlist-track': item.isTrack && !playlist.query }">
                    <component
                        :is="item.component"
                        v-bind="item.props"
                        @playThis="playFromPlaylistPage(item.props.index - 1)"
                    ></component>
                </div>
            </template>
        </VirtualList>
    </div>
</template>

<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import VirtualList from 'vue-virtual-sortable'
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
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'
import { useT } from '@/i18n'

const { t } = useT()

;[Header, AfterHeader, SongItem, NoItems, AlbumsFetcher].forEach(markRaw)

const queue = useQueue()
const tracklist = useTracklist()
const playlist = usePlaylistStore()
const dragging = ref(false)

interface ScrollerItem {
    id: string
    component: typeof Header | typeof SongItem | typeof NoItems | typeof AlbumsFetcher
    size: number
    props?: {}
    isTrack?: boolean
}

const getNoItemsComponent = () =>
    <ScrollerItem>{
        id: 'Noitems',
        component: NoItems,
        size: 300, // somehow it doesn't work, patched with CSS
        props: {
            icon: playlistSvg,
            flag: playlist.tracks.length === 0,
            title: t('Views.PlaylistView.NoTracks'),
            description: t('Views.PlaylistView.AddMoreDesc'),
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
            isTrack: true,
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
            id: 'fetcher',
            size: 1,
            component: AlbumsFetcher,
            props: {
                fetch_callback: () => playlist.fetchAll(playlist.info.id),
            },
        })
    }

    return [header, afterHeader, ...body]
})

function onDrop({ item, list, newIndex, changed }: { item: ScrollerItem; list: ScrollerItem[]; newIndex: number; changed: boolean }) {
    dragging.value = false
    if (!changed || playlist.query) return

    const next = list.slice(newIndex + 1).find(i => i.isTrack)
    if (!next && playlist.allTracks.length < playlist.info.count) return

    playlist.moveTrack((item.props as any).track.trackhash, next ? (next.props as any).track.trackhash : null)
}

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

</script>

<style lang="scss">
.playlist-drag-ghost {
    z-index: 100000 !important;
    background-color: $gray4;
    border-radius: $small;
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.5);

    .songlist-item {
        background-color: transparent !important;
    }
}

.playlist-drag-placeholder {
    visibility: hidden;
}

.dragging [role='item'] > * {
    pointer-events: none;
}

.playlist-virtual-scroller {
    .nothing {
        height: 25rem;
    }
}
</style>
