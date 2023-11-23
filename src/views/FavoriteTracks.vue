<template>
  <SongList
    :tracks="tracks"
    :handle-play="handlePlay"
    :is_queue="false"
    :drop-handler="() => {}"
    :source="dropSources.favorite"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";

import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";

import { dropSources } from "@/enums";
import { Track } from "@/interfaces";
import { getFavTracks } from "@/requests/favorite";

import SongList from "@/components/shared/SongList.vue";

const tracks: Ref<Track[]> = ref([]);
const queue = useQueueStore();
const tracklist = useTracklist();

getFavTracks(0).then((data) => (tracks.value = data));

function handlePlay(index: number) {
  tracklist.setFromFav(tracks.value);
  queue.play(index);
}
</script>
