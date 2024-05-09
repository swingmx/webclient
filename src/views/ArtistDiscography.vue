<template>
  <div class="content-page artistdiscogview">
    <GenericHeader>
      <template #name>{{ getTypeName(route.params.type) }}</template>
      <template #description>
        <RouterLink
          :to="{
            name: Routes.artist,
            params: {
              hash: route.params.hash,
            },
          }"
          >{{ route.query.artist }}</RouterLink
        >
        • {{ artist.toShow.length }}
        <span class="caps">{{ getTypeString(route.params.type.toString()) }}</span></template
      >
    </GenericHeader>
    <GenericTabs
      :items="
        Object.values(discographyAlbumTypes).map((type) => ({
          title: type,
          params: {
            hash: route.params.hash,
            type: type,
          },
          query: { artist: route.query.artist },
        }))
      "
      :active="
        (item) => {
          return item.title == route.params.type;
        }
      "
      :route="Routes.artistDiscography"
    /><br />
    <div v-if="artist.toShow.length" class="cards">
      <AlbumCard
        v-for="album in artist.toShow.sort((a, b) => parseInt(b.date) - parseInt(a.date))"
        :key="album.albumhash"
        :album="album"
        :artist_page="true"
        :show_date="true"
      />
    </div>
    <NoItems
      v-else
      :title="'No contributions'"
      :flag="!artist.toShow.length"
      :icon="AlbumSvg"
      :description="`No ${getTypeName($route.params.type)} found for ${route.query.artist}`"
    />
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { onMounted } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";

import { discographyAlbumTypes } from "@/enums";
import useArtistDiscography from "@/stores/pages/artistDiscog";
import updatePageTitle from "@/utils/updatePageTitle";

import AlbumSvg from "@/assets/icons/album.svg";
import AlbumCard from "@/components/shared/AlbumCard.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";
import GenericTabs from "@/components/shared/GenericTabs.vue";
import NoItems from "@/components/shared/NoItems.vue";

const route = useRoute();
const artist = useArtistDiscography();

function getTypeString(type: string) {
  if (type === "all") return "Contributions";
  return getTypeName(type);
}

function getTypeName(type: string | string[]) {
  // @ts-ignore
  if (type == "all") return "All Albums";
  return type;
}

onMounted(() => {
  updatePageTitle("Discography" + (route.params.artist || ""));
  artist.fetchAlbums(route.params.hash as string);
});

onBeforeRouteUpdate((to, from, next) => {
  artist.setAlbums(to.params.type as string);
  next();
});

onBeforeRouteLeave(() => artist.resetStore());
</script>

<style lang="scss">
.artistdiscogview {
  height: 100%;
  overflow: auto;

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax($cardwidth, 1fr));
    gap: 2rem 0;

    @include mediumPhones {
      grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    }
  }

  .generichead {
    h1,
    .caps {
      text-transform: capitalize;
    }
  }

  .generictabs {
    padding: 0 1rem;
    text-transform: capitalize;
  }

  .nothing {
    height: max-content;
    padding-top: 5rem;
  }
}
</style>
