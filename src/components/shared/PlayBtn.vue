<template>
  <button class="play-btn circular" @click.prevent.stop="handlePlay">
    <PlaySvg />
  </button>
</template>

<script setup lang="ts">
import { Track } from "@/interfaces";
import { playSources } from "@/enums";
import { playFromAlbumCard, playFromArtistCard } from "@/helpers/usePlayFrom";

import PlaySvg from "@/assets/icons/play.svg";
import useQueueStore from "@/stores/queue";
import useSearchStore from "@/stores/search";

const props = defineProps<{
  source: playSources | null;
  albumHash?: string;
  albumName?: string;
  artisthash?: string;
  artistname?: string;
  track?: Track;
}>();

function handlePlay() {
  switch (props.source) {
    case playSources.album:
      playFromAlbumCard(props.albumHash || "", props.albumName || "");
      break;

    case playSources.artist:
      playFromArtistCard(props.artisthash || "", props.artistname || "");
      break;

    case playSources.track: {
      // insert after current and play
      if (!props.track) break;

      const queue = useQueueStore();
      const search = useSearchStore();

      queue.clearQueue();
      queue.playFromSearch(search.query, [props.track]);
      queue.play();
      break;
    }

    default:
      break;
  }
}
</script>

<style lang="scss">
.play-btn {
  aspect-ratio: 1;
  padding: 0;
  background: $darkblue;
  display: grid;
  place-items: center;

  svg {
    transition: none;
  }
}
</style>
