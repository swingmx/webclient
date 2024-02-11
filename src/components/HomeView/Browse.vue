<template>
  <div class="homebrowse">
    <div class="btitle"><b>Browse Library</b></div>
    <div class="browselist">
      <RouterLink
        v-for="i in browselist"
        :key="i.title"
        class="browseitem rounded-sm t-center"
        :to="{ name: i.route, params: i.params }"
        :style="{ width: `${album_card_with - 24}px` }"
      >
        {{ i.title }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { album_card_with } from "@/stores/content-width";

const browselist = [
  {
    title: "Folders",
    route: Routes.folder,
    params: {
      path: "$home",
    },
  },
  {
    title: "Albums",
    route: Routes.AlbumList,
  },
  {
    title: "Artists",
    route: Routes.ArtistList,
  },
  {
    title: "Playlists",
    route: Routes.playlists,
  },
  {
    title: "Favorites",
    route: Routes.favorites,
  },
  {
    title: "Favorite Tracks",
    route: Routes.favoriteTracks,
  },
];
</script>

<style lang="scss">
.homebrowse {
  padding: 1.5rem 0;
  padding-left: $small;

  .btitle {
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }

  .browselist {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: $small;
  }

  .browseitem {
    padding: 1.5rem 0;
    background-color: $gray;
    color: $white;
  }

  .browseitem:hover {
    background-color: $gray5;
  }
}
</style>
