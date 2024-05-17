<template>
  <SongList
  :tracks="duplicateTracks(tracks)"
    :handle-play="handlePlay"
    :is_queue="false"
    :drop-handler="() => {}"
    :source="dropSources.favorite"
    :total="tracks.length"
    >
    <template #header>
      <GenericHeader>
        <template #name>Favorite Tracks</template>
        <template #description>You have {{ tracks.length }} favorited track{{ tracks.length == 1 ? '' : 's' }}</template>
      </GenericHeader>
    </template>
  </SongList>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";

import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";

import { dropSources } from "@/enums";
import { Track } from "@/interfaces";
import { getFavTracks } from "@/requests/favorite";

import SongList from "@/components/shared/SongList.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";

const tracks: Ref<Track[]> = ref([]);
const queue = useQueueStore();
const tracklist = useTracklist();

function duplicateTracks(tracks: Track[], times: number = 1,) {
  const newTracks = [];
  for (let i = 0; i < times; i++) {
    newTracks.push(...tracks);
  }
  return newTracks;
}

getFavTracks(0).then((data) => (tracks.value = data));

function handlePlay(index: number) {
  tracklist.setFromFav(tracks.value);
  queue.play(index);
}
</script>
