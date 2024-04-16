<template>
  <button class="play-btn circular" @click.prevent.stop="handlePlay">
    <PlaySvg />
  </button>
</template>

<script setup lang="ts">
import { playSources } from "@/enums";
import {
  playFromAlbumCard,
  playFromArtistCard,
  playFromFavorites,
  playFromFolderCard,
  playFromPlaylist,
} from "@/helpers/usePlayFrom";
import { Track } from "@/interfaces";

import PlaySvg from "@/assets/icons/play.svg";
import useQueue from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";
import useSearchStore from "@/stores/search";

const props = defineProps<{
  source: playSources | null;
  albumHash?: string;
  albumName?: string;
  artisthash?: string;
  artistname?: string;
  folderpath?: string;
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
    case playSources.folder:
      playFromFolderCard(props.folderpath || "");
      break;
    case playSources.recentlyAdded:
      playFromPlaylist("recentlyadded", props.track);
      break;
    case playSources.track: {
      // insert after current and play
      if (!props.track) break;

      const queue = useQueue();
      const search = useSearchStore();
      const tracklist = useTracklist();

      queue.clearQueue();
      tracklist.setFromSearch(search.query, [props.track]);
      queue.play();
      break;
    }
    case playSources.favorite:
      playFromFavorites(props.track);
      break;

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
    transition: transform 0.2s ease;
  }
}
</style>
