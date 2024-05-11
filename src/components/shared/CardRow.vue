<template>
  <div v-if="type == 'album'" class="cardlistrow">
    <AlbumCard v-for="item in items" :key="item.albumhash" class="hlistitem" :album="(item as Album)" />
  </div>
  <div v-else-if="type == 'artist'" class="cardlistrow">
    <ArtistCard v-for="item in items" :key="item.artisthash" class="hlistitem" :artist="(item as Artist)" />
  </div>
</template>

<script setup lang="ts">
import { Album, Artist } from "@/interfaces";
import AlbumCard from "./AlbumCard.vue";
import ArtistCard from "./ArtistCard.vue";

defineProps<{
  type: "album" | "artist";
  items: Album[] | Artist[];
}>();
</script>

<style lang="scss">
.cardlistrow {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($cardwidth, 1fr));
  padding-bottom: 2rem;
  z-index: -1;

  @include mediumPhones {
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  }
}
</style>
