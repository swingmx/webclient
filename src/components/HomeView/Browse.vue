<template>
  <div class="homebrowse">
    <div class="btitle"><b>Browse Library</b></div>
    <div class="browselist">
      <RouterLink
        v-for="i in browselist"
        :key="i.title"
        class="browseitem rounded-sm"
        :to="{ name: i.route || '', params: i.params }"
        :style="{ width: `${album_card_with - 24}px` }"
        @click="i.action && i.action()"
        :class="i.class"
      >
        <div class="icon" v-html="i.icon"></div>
        <div style="width: 100%">
          {{ i.title }}
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlbumIcon,
  ArtistIcon,
  FolderIcon,
  HeartIcon,
  PlaylistIcon,
  SettingsIcon,
  ReloadIcon
} from "@/icons";
import { triggerScan } from "@/requests/settings/rootdirs";
import { Routes } from "@/router";
import { album_card_with } from "@/stores/content-width";
import useDialog from "@/stores/modal";

const browselist = [
  {
    title: "Folders",
    route: Routes.folder,
    params: {
      path: "$home",
    },
    icon: FolderIcon,
  },
  {
    title: "Albums",
    route: Routes.AlbumList,
    icon: AlbumIcon,
  },
  {
    title: "Artists",
    route: Routes.ArtistList,
    icon: ArtistIcon,
  },
  {
    title: "Playlists",
    route: Routes.playlists,
    icon: PlaylistIcon,
  },
  {
    title: "Favorites",
    route: Routes.favorites,
    icon: HeartIcon,
    class: "favorite",
  },
  {
    title: "Fav. tracks",
    route: Routes.favoriteTracks,
    icon: HeartIcon,
    class: "favorite",
  },
  {
    title: "Fav. artists",
    route: Routes.favoriteArtists,
    icon: ArtistIcon,
    class: "favorite",
  },
  {
    title: "Fav. albums",
    route: Routes.favoriteAlbums,
    icon: AlbumIcon,
    class: "favorite",
  },
  {
    title: "Settings",
    route: null,
    icon: SettingsIcon,
    action: () => {
      useDialog().showSettingsModal();
    },
    class: "settings",
  },
  {
    title: "Quick scan",
    route: null,
    icon: ReloadIcon,
    action: triggerScan,
    class: "reload",
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
    padding-left: 0.25rem;
  }

  .browselist {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: $small;
  }

  .browseitem {
    font-weight: 500;
    padding: 1.25rem 1rem;
    background-color: $gray;
    color: $white;
    transition: background-color 0.2s ease-out;

    display: grid;
    grid-template-columns: max-content 1fr;
    place-items: center;
    gap: $small;

    .icon {
      height: 1.75rem;
    }

    svg {
      height: 1.75rem;
      color: $gray1;
    }
  }

  .settings svg {
    color: $brown;
  }

  .reload svg {
    // INFO: The icons is a bit larger than the others
    width: 1.25rem;
  }

  .browseitem:hover {
    background-color: $gray5;
  }
}
</style>
