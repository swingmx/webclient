<template>
  <SongList
    :tracks="tracks"
    :handlePlay="handlePlay"
    :is_queue="false"
    :dropHandler="() => {}"
    :source="dropSources.favorite"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";

import { Track } from "@/interfaces";
import { getFavTracks } from "@/requests/favorite";
import useQueueStore from "@/stores/queue";

import SongList from "@/components/shared/SongList.vue";
import { dropSources } from "@/enums";

const tracks: Ref<Track[]> = ref([]);
const queue = useQueueStore();

getFavTracks(0).then((data) => (tracks.value = data));

function handlePlay(index: number) {
  queue.playFromFav(tracks.value);
  queue.play(index);
}
</script>
