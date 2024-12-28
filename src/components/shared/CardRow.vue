<template>
  <div v-if="type == 'album'" class="cardlistrow">
    <AlbumCard v-for="item in items" :key="item.albumhash" class="hlistitem" :album="(item as Album)" />
  </div>
  <div v-else-if="type == 'artist'" class="cardlistrow">
    <ArtistCard v-for="item in items" :key="item.artisthash" class="hlistitem" :artist="(item as Artist)" />
  </div>
  <div v-else-if="type == 'mix'" class="cardlistrow">
    <MixCard v-for="item in items" :key="item.sourcehash" class="hlistitem" :mix="(item as Mix)" />
  </div>
</template>

<script setup lang="ts">
import { Album, Artist, Mix } from "@/interfaces";
import AlbumCard from "./AlbumCard.vue";
import ArtistCard from "./ArtistCard.vue";
import MixCard from "../Mixes/MixCard.vue";

defineProps<{
  type: string | "album" | "artist" | "mix";
  items: Album[] | Artist[] | Mix[];
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
