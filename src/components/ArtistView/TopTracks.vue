<template>
  <div class="artist-top-tracks">
    <h3 class="section-title">
      {{ title }}
      <SeeAll :route="route" />
    </h3>
    <div class="tracks" :class="{ isSmall, isMedium }">
      <SongItem
        v-for="(song, index) in tracks"
        :track="song"
        :index="index + 1"
        @playThis="playHandler(index)"
        :source="source"
      />
    </div>
    <div class="error" v-if="!tracks.length">No tracks</div>
  </div>
</template>

<script setup lang="ts">
import SongItem from "../shared/SongItem.vue";
import { Track } from "@/interfaces";
import { isMedium, isSmall } from "@/stores/content-width";
import SeeAll from "../shared/SeeAll.vue";
import { dropSources } from "@/composables/enums";

defineProps<{
  tracks: Track[];
  route: string;
  title: string;
  playHandler: (index: number) => void;
  source: dropSources;
}>();
</script>

<style lang="scss">
.artist-top-tracks {
  padding-top: 1rem;

  .section-title {
    margin-left: 0;
    align-items: baseline;
  }

  .error {
    padding-left: 1rem;
    color: $red;
  }

  h3 {
    display: flex;
    justify-content: space-between;
    padding-left: 1rem !important; // applies to favorite page
  }
}
</style>
