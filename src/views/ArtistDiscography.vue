<template>
  <div class="card-grid-view v-scroll-page">
    <div class="scrollable">
      <AlbumCard
        v-for="album in artist.toShow.sort(
          (a, b) => parseInt(b.date) - parseInt(a.date)
        )"
        :key="album.albumhash"
        :album="album"
        :artist_page="true"
        :show_date="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

import updatePageTitle from "@/utils/updatePageTitle";
import useArtistDiscographyStore from "@/stores/pages/artistDiscog";

import AlbumCard from "@/components/shared/AlbumCard.vue";

const route = useRoute();
const artist = useArtistDiscographyStore();

onMounted(() => {
  updatePageTitle("Discography" + (route.params.artist || ""));
  artist.fetchAlbums(route.params.hash as string);
});

onBeforeRouteLeave(() => {
  artist.resetAlbums();
});
</script>
