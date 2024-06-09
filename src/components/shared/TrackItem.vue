<template>
  <div
    v-wave="{
      duration: 0.35,
    }"
    class="track-item"
    :class="[
      {
        currentInQueue: isCurrent,
      },
      { contexton: context_on },
    ]"
    @click="playThis(track)"
    @contextmenu.prevent="showMenu"
  >
    <div class="album-art">
      <img :src="paths.images.thumb.small + track.image" class="rounded-sm" />
      <div v-if="isCurrent" class="now-playing-track-indicator image" :class="{ last_played: !isCurrentPlaying }"></div>
    </div>
    <div class="tags">
      <div v-tooltip class="title">
        <span class="ellip">
          {{ track.title }}
        </span>
      </div>
      <hr />
      <div class="artist">
        <ArtistName :artists="track.artists" :albumartists="track.albumartists" :smaller="true" />
      </div>
    </div>
    <div class="float-buttons flex">
      <div
        class="fav-icon"
        :title="is_fav ? 'Add to favorites' : 'Remove from favorites'"
        @click.stop="() => addToFav(track.trackhash)"
      >
        <HeartSvg :state="is_fav" :no_emit="true" />
      </div>
      <div v-if="isQueueTrack" class="remove-track" title="Remove from queue" @click.stop="player.removeByIndex(index)">
        <DelSvg />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

import useTracklist from "@/stores/queue/tracklist";

import { paths } from "@/config";
import { favType } from "@/enums";
import { showTrackContextMenu as showContext } from "@/helpers/contextMenuHandler";
import favoriteHandler from "@/helpers/favoriteHandler";
import { Track } from "@/interfaces";

import DelSvg from "@/assets/icons/plus.svg";
import ArtistName from "./ArtistName.vue";
import HeartSvg from "./HeartSvg.vue";

const props = defineProps<{
  track: Track;
  isCurrent: boolean;
  isCurrentPlaying: boolean;
  isQueueTrack?: boolean;
  index?: number;
}>();

const player = useTracklist();

const context_on = ref(false);
const is_fav = ref(props.track.is_favorite);

function showMenu(e: MouseEvent) {
  showContext(e, props.track, context_on);
}

const emit = defineEmits<{
  (e: "playThis"): void;
}>();

const playThis = (track: Track) => {
  emit("playThis");
};

function addToFav(trackhash: string) {
  favoriteHandler(
    is_fav.value,
    favType.track,
    trackhash,
    () => (is_fav.value = true),
    () => (is_fav.value = false)
  );
}

const stop = watch(
  () => props.track.is_favorite,
  (newValue) => {
    is_fav.value = newValue;
  }
);

onBeforeUnmount(() => {
  stop();
});
</script>

<style lang="scss">
.track-item.currentInQueue {
  background-color: $gray4;
}

.contexton {
  background-color: $gray4;
  color: $white !important;
}

.track-item {
  display: grid;
  grid-template-columns: min-content 1fr max-content;
  align-items: center;
  padding: $small 1rem;
  transition: background-color 0.2s ease-out;

  .tags {
    .title {
      width: fit-content;
      font-weight: 600;
    }
  }

  .float-buttons {
    opacity: 0;
    gap: $small;
    & > * {
      cursor: pointer;
    }

    .heart-button {
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: none;
      background-color: transparent;

      svg {
        color: white;
      }
    }

    .remove-track {
      transform: rotate(45deg);
      height: 2rem;
      width: 2rem;

      display: grid;
      place-items: center;

      &:hover {
        border-radius: 1rem;
      }
    }

    &:hover {
      opacity: 1 !important;
    }
  }

  &:hover {
    .float-buttons {
      opacity: 1;
    }

    .remove-track {
      transform: translateY(0) rotate(45deg);
    }

    background-color: $gray5;
  }

  hr {
    border: none;
    margin: 0.1rem;
  }

  .album-art {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: $medium;
    position: relative;

    .now-playing-track-indicator {
      position: absolute;
    }
  }

  img {
    width: 3rem;
    height: 3rem;
    object-fit: contain;
  }

  .artist {
    opacity: 0.67;
    width: fit-content;
    font-weight: 700;
  }
}
</style>
