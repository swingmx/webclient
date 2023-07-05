<template>
  <div
    class="songlist-item rounded-sm"
    :class="[{ current: isCurrent() }, { contexton: context_menu_showing }]"
    @dblclick.prevent="emitUpdate"
    @contextmenu.prevent="showMenu"
  >
    <TrackIndex
      v-if="!isSmallPhone"
      :index="index"
      :is_fav="track.is_favorite"
      @add-to-fav="addToFav(track.trackhash)"
    />
    <TrackTitle
      :track="track"
      :is_current="isCurrent()"
      :is_current_playing="isCurrentPlaying()"
      @play="emitUpdate"
    />
    <div class="song-artists">
      <ArtistName :artists="track.artist" :albumartists="track.albumartist" />
    </div>

    <TrackAlbum
      :album="track.album || 'Unknown'"
      :albumhash="track.albumhash || ''"
      :hide_album="hide_album || false"
    />
    <TrackDuration :duration="track.duration || 0" @showMenu="showMenu" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

import { showTrackContextMenu as showContext } from "@/composables/context";
import { dropSources, favType } from "@/composables/enums";
import favoriteHandler from "@/composables/favoriteHandler";
import { Track } from "@/interfaces";
import useQueueStore from "@/stores/queue";

import ArtistName from "./ArtistName.vue";
import TrackIndex from "./SongItem/TrackIndex.vue";
import TrackTitle from "./SongItem/TrackTitle.vue";
import TrackAlbum from "./SongItem/TrackAlbum.vue";
import TrackDuration from "./SongItem/TrackDuration.vue";
import { isSmallPhone } from "@/stores/content-width";

const context_menu_showing = ref(false);
const queue = useQueueStore();

const props = defineProps<{
  track: Track;
  index: number | string;
  hide_album?: boolean;
  is_queue_track?: boolean;
  droppable?: boolean;
  is_last?: boolean;
  source: dropSources;
}>();

const is_fav = ref(props.track.is_favorite);

const emit = defineEmits<{
  (e: "playThis"): void;
  (
    e: "trackDropped",
    source: dropSources,
    track: Track,
    newIndex: number,
    oldIndex: number
  ): void;
}>();

function emitUpdate() {
  emit("playThis");
}

function showMenu(e: MouseEvent) {
  showContext(e, props.track, context_menu_showing);
}

function isCurrent() {
  if (props.is_queue_track) {
    return queue.currentindex == parseInt(props.index as string) - 1;
  }

  return queue.currenttrackhash == props.track.trackhash;
}

function isCurrentPlaying() {
  return isCurrent() && queue.playing;
}

function addToFav(trackhash: string) {
  favoriteHandler(
    is_fav.value,
    favType.track,
    trackhash,
    () => (is_fav.value = true),
    () => (is_fav.value = false)
  );
}

const stopWatcher = watch(
  () => props.track.is_favorite,
  (newValue) => {
    is_fav.value = newValue;
  }
);

onBeforeUnmount(() => {
  stopWatcher();
});
</script>

<style lang="scss">
.songlist-item {
  display: grid;
  grid-template-columns: 1.75rem 2fr 1fr 1.5fr 5.5rem;
  align-items: center;
  justify-content: flex-start;
  height: $song-item-height;
  gap: 1rem;
  user-select: none;
  padding-left: $small;
  border: solid 1px transparent;
  position: relative;

  &:hover {
    background-color: $gray5;
    border: solid 1px $gray4;

    .index {
      .text {
        transition-delay: 500ms;

        transform: translateX($smaller);
        opacity: 0;
      }

      .heart-icon {
        transition-delay: 500ms;

        transform: translateX(0);
      }
    }
  }

  .song-artists {
    width: fit-content;
    max-width: 100%;
  }
}

.songlist-item.current {
  background-color: $gray;
}

.songlist-item.contexton {
  background-color: $gray4 !important;
  border: solid 1px $gray3;
}
</style>
