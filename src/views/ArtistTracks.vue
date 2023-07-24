<template>
  <div
    class="v-scroll-page"
    :class="{ isSmall, isMedium }"
    style="height: 100%"
  >
    <RecycleScroller
      class="scroller"
      style="height: 100%"
      :items="scrollerItems"
      :item-size="itemHeight"
      key-field="id"
      v-slot="{ item, index }"
    >
      <SongItem
        :track="item.track"
        :index="index + 1"
        @playThis="playFromPage(index)"
        :source="dropSources.artist"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";

import { Track } from "@/interfaces";
import { getArtistTracks } from "@/requests/artists";
import { isMedium, isSmall } from "@/stores/content-width";
import useQueueStore from "@/stores/queue";
import { createTrackProps } from "@/utils";

import SongItem from "@/components/shared/SongItem.vue";
import { dropSources, FromOptions } from "@/enums";

const itemHeight = 64;
const route = useRoute();
const queue = useQueueStore();

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

  if (queue.from.type == FromOptions.artist && queue.from.artisthash == hash) {
    queue.play(index);
    return;
  }

  queue.playFromArtist(hash, artist, tracks.value);
  queue.play(index);
}
</script>
