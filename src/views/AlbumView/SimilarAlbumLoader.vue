<template>
  <ArtistAlbums
    v-if="store.similarAlbums.length"
    :albums="store.similarAlbums"
    :title="'Related Albums'"
  />
</template>

<script setup lang="ts">
import useAlbumStore from "@/stores/pages/album";
import ArtistAlbums from "@/components/AlbumView/ArtistAlbums.vue";

const store = useAlbumStore();
</script>
