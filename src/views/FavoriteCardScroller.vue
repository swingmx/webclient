<template>
  <CardGridPage :page="itemtype" :items="items">
    <template #header>
      <GenericHeader>
        <template #name>Favorite <span style="text-transform: capitalize;">{{ itemtype }}s</span></template>
        <template #description>You have {{ items.length }} favorited {{ itemtype + (items.length == 1 ? '' : 's')}}</template>
      </GenericHeader>
    </template>
  </CardGridPage>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { useRoute } from "vue-router";
import { computed, onMounted, Ref, ref } from "vue";

import { Album, Artist } from "@/interfaces";
import { getFavAlbums, getFavArtists } from "@/requests/favorite";

import CardGridPage from "./SearchView/CardGridPage.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";

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
