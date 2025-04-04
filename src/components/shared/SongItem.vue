<template>
    <div
        class="songlist-item rounded-sm"
        :class="[{ current: isCurrent() }, { contexton: context_menu_showing }]"
        @contextmenu.prevent="showMenu"
    >
        <TrackIndex
            v-if="!isSmall"
            :index="index"
            :is_fav="is_fav"
            @add-to-fav="addToFav(track.trackhash)"
            :show-inline-fav-icon="settings.showInlineFavIcon"
        />

        <TrackTitle
            :track="track"
            :is_current="isCurrent()"
            :is_current_playing="isCurrentPlaying()"
            @play="emitUpdate"
        />
        <div class="song-artists">
            <ArtistName :artists="track.artists" :albumartists="track.albumartists" />
        </div>

        <TrackAlbum
            :album="track.album || 'Unknown'"
            :albumhash="track.albumhash || ''"
            :hide_album="hide_album || false"
        />
        <TrackDuration
            :duration="track.duration || 0"
            @showMenu="showMenu"
            @toggleFav="addToFav(track.trackhash)"
            :help_text="track.help_text"
            :is_fav="is_fav"
            :showFavIcon="!isFavoritesPage"
            :showInlineFavIcon="settings.showInlineFavIcon"
            :highlightFavoriteTracks="settings.highlightFavoriteTracks"
        />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { dropSources, favType } from '@/enums'
import { showTrackContextMenu as showContext } from '@/helpers/contextMenuHandler'
import favoriteHandler from '@/helpers/favoriteHandler'
import { Track } from '@/interfaces'
import { isSmall } from '@/stores/content-width'
import useQueueStore from '@/stores/queue'

import ArtistName from './ArtistName.vue'
import TrackAlbum from './SongItem/TrackAlbum.vue'
import TrackDuration from './SongItem/TrackDuration.vue'
import TrackIndex from './SongItem/TrackIndex.vue'
import TrackTitle from './SongItem/TrackTitle.vue'
import useSettings from '@/stores/settings'

const settings = useSettings()
const context_menu_showing = ref(false)

const queue = useQueueStore()

const props = defineProps<{
    track: Track
    index: number | string
    hide_album?: boolean
    is_queue_track?: boolean
    droppable?: boolean
    is_last?: boolean
    source: dropSources
}>()

const is_fav = ref(props.track.is_favorite || false)

const emit = defineEmits<{
    (e: 'playThis'): void
    (e: 'trackDropped', source: dropSources, track: Track, newIndex: number, oldIndex: number): void
}>()

function emitUpdate() {
    emit('playThis')
}

function showMenu(e: MouseEvent) {
    showContext(e, props.track, context_menu_showing)
}

function isCurrent() {
    if (props.is_queue_track) {
        return queue.currentindex == parseInt(props.index as string) - 1
    }

    return queue.currenttrackhash == props.track.trackhash
}

function isCurrentPlaying() {
    return isCurrent() && queue.playing
}

function addToFav(trackhash: string) {
    favoriteHandler(
        is_fav.value,
        favType.track,
        trackhash,
        () => (is_fav.value = true),
        () => (is_fav.value = false)
    )
}

const stopWatcher = watch(
    () => props.track.trackhash,
    () => {
        is_fav.value = props.track.is_favorite
    }
)

onBeforeUnmount(() => {
    stopWatcher()
})

const route = useRoute()
const isFavoritesPage = route.path.startsWith('/favorites')
</script>

<style lang="scss">
// NOTE: CSS for responsiveness is at app-grid.scss
.songlist-item {
    display: grid;
    grid-template-columns: 1.75rem 1.25fr 1fr 1fr 7.5rem;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    font-weight: 500;
    line-height: 1.2;
    height: $song-item-height;
    user-select: none;
    padding-left: $small;
    position: relative;
    transition: background-color 0.2s ease-out;

    &:hover {
        background-color: $gray;

        .index.ready {
            .text {
                transition-delay: 400ms;

                transform: translateX(0);
                opacity: 0;
            }

            .heart-icon {
                transition-delay: 400ms;
                transform: translateX(0);
                opacity: 1;
                visibility: visible;
            }
        }

        .song-duration.has_help_text {
            opacity: 0;
        }

        // INFO: Show help text on hover
        .song-duration.help-text {
            opacity: 1;
        }

        .options-and-duration .heart-icon.showInlineFavIcon {
            display: block;
        }
    }

    .index {
        overflow: unset !important;

        .heart-icon {
            opacity: 0;
            visibility: hidden;
        }
    }

    .song-artists {
        width: fit-content;
        max-width: calc(100% - 10px);
    }
}

.songlist-item.current {
    background-color: $gray;
}

.songlist-item.contexton {
    background-color: $gray4 !important;
}
</style>
