<template>
  <div class="content-page favorites-page">
    <GenericHeader>
      <template #name>Favorites</template>
      <template #description
        >{{ count.tracks }} Tracks • {{ count.albums }} Albums • {{ count.artists }} Artists</template
      >
    </GenericHeader>
    <CardScroller
      v-if="recentFavs.length"
      class="recent-favs"
      :items="recentFavs"
      :title="'Recent'"
      :play-source="playSources.favorite"
    />
    <div v-if="favTracks.length" class="fav-tracks">
      <TopTracks
        :tracks="favTracks"
        :route="'/favorites/tracks'"
        :title="'Tracks'"
        :play-handler="handlePlay"
        :source="dropSources.favorite"
        :total="count.tracks"
      />
    </div>
    <br />
    <CardScroller
      v-if="favAlbums.length"
      :items="favAlbums.map((i) => ({ type: 'album', item: i }))"
      :title="'Albums'"
      :route="'/favorites/albums'"
    />

    <CardScroller
      v-if="favArtists.length"
      :items="favArtists.map((i) => ({ type: 'artist', item: i }))"
      :title="'Artists'"
      :route="'/favorites/artists'"
    />

    <NoItems :flag="noFavs" :icon="HeartSvg" :title="'No favorites found'" :description="description" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, Ref, ref } from "vue";

import { maxAbumCards, updateCardWidth } from "@/stores/content-width";

import { dropSources, playSources } from "@/enums";
import { playFromFavorites } from "@/helpers/usePlayFrom";
import { Album, Artist, RecentFavResult, Track } from "@/interfaces";
import { getAllFavs } from "@/requests/favorite";
import updatePageTitle from "@/utils/updatePageTitle";

import HeartSvg from "@/assets/icons/heart-no-color.svg";
import TopTracks from "@/components/ArtistView/TopTracks.vue";
import CardScroller from "@/components/shared/CardScroller.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";
import NoItems from "@/components/shared/NoItems.vue";

const description = `You can add tracks, albums and artists to your favorites by clicking the heart icon`;

const recentFavs: Ref<RecentFavResult[]> = ref([]);
const favAlbums: Ref<Album[]> = ref([]);
const favTracks: Ref<Track[]> = ref([]);
const favArtists: Ref<Artist[]> = ref([]);
const count = ref({
  albums: 0,
  tracks: 0,
  artists: 0,
});
const noFavs = ref(false);

onMounted(() => {
  updatePageTitle("Favorites");
  const max = maxAbumCards.value;

  getAllFavs(6, max, max)
    .then((favs) => {
      recentFavs.value = favs.recents;
      favAlbums.value = favs.albums;
      favTracks.value = favs.tracks;
      favArtists.value = favs.artists;
      count.value = favs.count;
    })
    .then(() => {
      noFavs.value = !favAlbums.value.length && !favTracks.value.length && !favArtists.value.length;
    })
    .then(async () => {
      await nextTick();
      updateCardWidth();
    });
});

function handlePlay(index: number) {
  const track = favTracks.value[index];
  if (!track) return;
  playFromFavorites(track);
}
</script>

<style lang="scss">
.favorites-page {
  height: 100%;
  overflow: auto;

  .recent-favs {
    padding-top: 1rem;
  }

  .nothing h3 {
    margin-top: 3rem;
  }

  .fav-tracks {
    h3 {
      margin-top: 0;
    }

    .artist-top-tracks {
      h3 {
        padding-right: $small;
      }
    }
  }
}
</style>
