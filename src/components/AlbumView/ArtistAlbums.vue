<template>
  <div
    class="artist-albums"
    :style="{
      height: `${heightCalculator(height + (artist_page ? 60 : 0))}px`,
      marginBottom: !artist_page ? '2rem' : '0',
    }"
  >
    <h3>
      <span>{{ title }}</span>
      <SeeAll
        v-if="maxAbumCards - 1 <= albums.length"
        :route="route"
        @click="
          !favorites ? useArtistDiscographyStore().setPage(albumType) : null
        "
      />
    </h3>
    <div class="cards" ref="artistItemsWrappers">
      <AlbumCard
        v-for="a in artist_page
          ? albums
              .slice(0, maxAbumCards)
              .sort((a, b) => parseInt(b.date) - parseInt(a.date))
          : albums.slice(0, maxAbumCards)"
        :album="a"
        :show_date="show_date"
        :artist_page="artist_page"
        :hide_artists="hide_artists"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";

import { discographyAlbumTypes } from "@/composables/enums";
import { Album } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";
import useArtistDiscographyStore from "@/stores/pages/artistDiscog";
import heightCalculator from "@/utils/heightCalculator";

import AlbumCard from "../shared/AlbumCard.vue";
import SeeAll from "../shared/SeeAll.vue";

defineProps<{
  title: string;
  albums: Album[];
  albumType?: discographyAlbumTypes;
  favorites?: boolean;
  route: string;
  show_date?: boolean;
  artist_page?: boolean;
  hide_artists?: boolean;
}>();

const artistItemsWrappers = ref<HTMLElement | null>(null);
const { height } = useElementSize(artistItemsWrappers);
</script>

<style lang="scss">
.artist-albums {
  overflow: hidden;

  h3 {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: baseline;
    padding: 0 $medium;
    margin-bottom: $medium;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 5rem 0;
  }

  .album-card {
    &:hover {
      background-color: $gray;
    }
  }
}
</style>
