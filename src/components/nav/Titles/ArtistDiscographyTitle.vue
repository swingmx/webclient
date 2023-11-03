<template>
  <div class="artist-discography-nav">
    <h1 class="ellip">{{ store.artistname }}</h1>
    <DropDown
      :items="albums"
      :current="store.page"
      component_key="discography"
      @item-clicked="switchView"
    />
  </div>
</template>

<script setup lang="ts">
import DropDown from "@/components/shared/DropDown.vue";
import { discographyAlbumTypes as albums } from "@/enums";

import useArtistDiscogStore from "@/stores/pages/artistDiscog";

const store = useArtistDiscogStore();

function switchView(album: albums) {
  store.setAlbums(album);
}
</script>

<style lang="scss">
.artist-discography-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  h1 {
    margin: 0;
  }

  .buttons {
    display: flex;
  }

  
}
</style>
