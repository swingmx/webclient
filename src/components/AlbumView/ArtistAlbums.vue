<template>
  <div class="card-list-scroll-x">
    <h3>
      <span>{{ title }}</span>
      <SeeAll
        v-if="route && maxAbumCards - 1 <= albums.length"
        :route="route"
        @click="
          !favorites ? useArtistDiscographyStore().setPage(albumType) : null
        "
      />
    </h3>
    <div ref="artistItemsWrappers" class="cards">
      <AlbumCard
        v-for="a in albums"
        :key="a.albumhash"
        :album="a"
        :show_date="show_date"
        :artist_page="artist_page"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { Album } from "@/interfaces";
import { discographyAlbumTypes } from "@/enums";
import { maxAbumCards } from "@/stores/content-width";
import useArtistDiscographyStore from "@/stores/pages/artistDiscog";

import AlbumCard from "../shared/AlbumCard.vue";
import SeeAll from "../shared/SeeAll.vue";

defineProps<{
  title: string;
  albums: Album[];
  albumType?: discographyAlbumTypes;
  favorites?: boolean;
  route?: string;
  show_date?: boolean;
  artist_page?: boolean;
}>();

const artistItemsWrappers = ref<HTMLElement | null>(null);
</script>

<style lang="scss">
.card-list-scroll-x {
  overflow: hidden;

  h3 {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: baseline;
    padding: 0 $medium;
    margin-bottom: $medium;
  }

  .cards {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    flex-direction: row;
    padding-bottom: 2rem;

    @include hideScrollbars;
  }

  .album-card {
    &:hover {
      background-color: $gray;
    }
  }
}
</style>
