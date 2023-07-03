<template>
  <div class="card-grid-view v-scroll-page">
    <div class="scrollable">
      <AlbumCard
        v-for="album in artist.toShow.sort(
          (a, b) => parseInt(b.date) - parseInt(a.date)
        )"
        :album="album"
        :key="album.albumhash"
        :artist_page="true"
        :show_date="artist.page != discographyAlbumTypes.appearances"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

import AlbumCard from "@/components/shared/AlbumCard.vue";
import { discographyAlbumTypes } from "@/composables/enums";
import useArtistDiscographyStore from "@/stores/pages/artistDiscog";
import updatePageTitle from "@/utils/updatePageTitle";

const artist = useArtistDiscographyStore();
const route = useRoute();

onMounted(() => {
  updatePageTitle("Discography" + (route.params.artist || ""));
  artist.fetchAlbums(route.params.hash as string);
});

onBeforeRouteLeave(() => {
  artist.resetAlbums();
});
</script>
