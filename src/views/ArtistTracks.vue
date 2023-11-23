<template>
  <div
    class="v-scroll-page"
    :class="{ isSmall, isMedium }"
    style="height: 100%"
  >
    <RecycleScroller
      v-slot="{ item, index }"
      class="scroller"
      style="height: 100%"
      :items="scrollerItems"
      :item-size="itemHeight"
      key-field="id"
    >
      <SongItem
        :track="item.track"
        :index="index + 1"
        :source="dropSources.artist"
        @playThis="playFromPage(index)"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onMounted, Ref, ref } from "vue";

import useQueue from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";

import { Track } from "@/interfaces";
import { createTrackProps } from "@/utils";
import { dropSources, FromOptions } from "@/enums";
import { getArtistTracks } from "@/requests/artists";
import { isMedium, isSmall } from "@/stores/content-width";

import SongItem from "@/components/shared/SongItem.vue";

const itemHeight = 64;
const route = useRoute();
const queue = useQueue();
const tracklist = useTracklist();

const tracks: Ref<Track[]> = ref([]);

onMounted(() => {
  const hash = route.params.hash as string;

  getArtistTracks(hash).then((t) => {
    tracks.value = t;
  });
});

const scrollerItems = computed(() => {
  return tracks.value.map((track, index) => {
    return {
      track,
      id: index,
      props: createTrackProps(track),
    };
  });
});

async function playFromPage(index: number) {
  const hash = route.params.hash as string;
  const artist = route.query.artist as string;

  if (tracklist.from.type == FromOptions.artist && tracklist.from.artisthash == hash) {
    queue.play(index);
    return;
  }

  tracklist.setFromArtist(hash, artist, tracks.value);
  queue.play(index);
}
</script>
