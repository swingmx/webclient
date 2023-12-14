<template>
  <CardGridPage :page="itemtype" :items="items" />
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { useRoute } from "vue-router";
import { computed, onMounted, Ref, ref } from "vue";

import { Album, Artist } from "@/interfaces";
import { getFavAlbums, getFavArtists } from "@/requests/favorite";

import CardGridPage from "./SearchView/CardGridPage.vue";

const route = useRoute();
const albums: Ref<Album[]> = ref([]);
const artists: Ref<Artist[]> = ref([]);

const itemtype = computed(() => {
  if (route.name == Routes.favoriteAlbums) {
    return "album";
  }

  return "artist";
});

const items = computed(() => {
  if (itemtype.value == "album") {
    return albums.value;
  }

  return artists.value;
});

onMounted(async () => {
  if (itemtype.value == "artist") {
    const data = await getFavArtists(0);
    return (artists.value = data);
  }

  const data = await getFavAlbums(0);
  return (albums.value = data);
});
</script>
