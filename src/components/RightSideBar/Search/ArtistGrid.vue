<template>
  <div v-auto-animate class="artists-results">
    <div>
      <div
        v-if="album_grid == true && search.albums.value.length"
        class="search-results-grid"
      >
        <AlbumCard
          v-for="a in search.albums.value"
          :key="a.albumid"
          :album="a"
        />
      </div>
      <div
        v-else-if="!album_grid && search.artists.value.length"
        class="search-results-grid"
      >
        <ArtistCard
          v-for="artist in search.artists.value"
          :key="artist.image"
          :artist="artist"
          :alt="true"
        />
      </div>
      <div v-else class="t-center">
        <h5>No {{ album_grid ? "albums" : "artists" }}</h5>
      </div>
    </div>
    <LoadMore
      v-if="search.albums.value.length || search.artists.value.length"
      :loader="album_grid ? search.loadAlbums : search.loadArtists"
      :can_load_more="album_grid ? search.albums.more : search.artists.more"
    />
  </div>
</template>

<script setup lang="ts">
import useSearchStore from "../../../stores/search";

import AlbumCard from "@/components/shared/AlbumCard.vue";
import ArtistCard from "../../shared/ArtistCard.vue";
import LoadMore from "./LoadMore.vue";

const search = useSearchStore();

defineProps<{
  album_grid?: boolean;
}>();
</script>

<style lang="scss">
.artists-results {
  height: 100%;
  display: grid;
  margin: 0 1rem;
  grid-template-rows: 1fr max-content;
}

.search-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  min-height: 10rem;
  padding-bottom: $small;
}
</style>
