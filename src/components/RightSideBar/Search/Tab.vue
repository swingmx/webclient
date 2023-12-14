<template>
  <component :is="getComponent()?.component" v-bind="getComponent()?.props" />
</template>

<script setup lang="ts">
import useSearch from "@/stores/search";

import TracksGrid from "./TracksGrid.vue";
import TopResults from "./TopResults.vue";
import CardPage from "@/views/SearchView/CardGridPage.vue";

const search = useSearch();
const props = defineProps<{
  name: string;
}>();

function getComponent() {
  switch (props.name) {
    case "top":
      return {
        component: TopResults,
      };

    case "tracks":
      return {
        component: TracksGrid,
      };
    case "albums":
      return {
        component: CardPage,
        props: {
          page: "album",
          items: search.albums.value,
          outside_route: true,
          fetch_callback: search.loadAlbums,
        },
      };
    case "artists":
      return {
        component: CardPage,
        props: {
          page: "artist",
          items: search.artists.value,
          outside_route: true,
          fetch_callback: search.loadArtists,
        },
      };
    default:
      return null;
  }
}
</script>
