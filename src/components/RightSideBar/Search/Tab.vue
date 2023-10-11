<template>
  <component :is="getComponent()?.component" v-bind="getComponent()?.props" />
</template>

<script setup lang="ts">
import ArtistGrid from "./ArtistGrid.vue";
import TracksGrid from "./TracksGrid.vue";
import TopResults from "./TopResults.vue";

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
        component: ArtistGrid,
        props: {
          album_grid: true,
        },
      };
    case "artists":
      return {
        component: ArtistGrid,
        props: {},
      };
    default:
      return null;
  }
}
</script>
