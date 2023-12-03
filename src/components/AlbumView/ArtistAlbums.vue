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
    <div class="cards">
      <AlbumCard
        v-for="a in albums.slice(0, maxAbumCards)"
        :key="a.albumhash"
        class="hlistitem"
        :album="a"
        :show_date="show_date"
        :artist_page="artist_page"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>
