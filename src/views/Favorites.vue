<template>
  <div class="content-page favorites-page">
    <div v-if="recentFavs.length" class="fav-recents">
      <CardScroller :items="recentFavs" :title="'Recent'" />
    </div>
    <div v-if="favTracks.length" class="fav-tracks">
      <TopTracks
        :tracks="favTracks"
        :route="'/favorites/tracks'"
        :title="'Tracks'"
        :play-handler="handlePlay"
        :source="dropSources.favorite"
      />
    </div>
    <div v-if="favAlbums.length" class="fav-albums">
      <CardScroller
        :items="favAlbums.map((i) => ({ type: 'album', item: i }))"
        :title="'Albums'"
        :route="'/favorites/albums'"
      />
    </div>

    <div v-if="favArtists.length" class="fav-artists">
      <CardScroller
        :items="favArtists.map((i) => ({ type: 'artist', item: i }))"
        :title="'Artists'"
        :route="'/favorites/artists'"
      />
    </div>

    <NoItems
      :flag="noFavs"
      :icon="HeartSvg"
      :title="'No favorites found'"
      :description="description"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, Ref, ref } from "vue";

import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";
import { maxAbumCards, updateCardWidth } from "@/stores/content-width";

import { dropSources } from "@/enums";
import updatePageTitle from "@/utils/updatePageTitle";
import { getAllFavs, getFavTracks } from "@/requests/favorite";
import { Album, Artist, RecentFavResult, Track } from "@/interfaces";

import NoItems from "@/components/shared/NoItems.vue";
import HeartSvg from "@/assets/icons/heart-no-color.svg";
import TopTracks from "@/components/ArtistView/TopTracks.vue";
import CardScroller from "@/components/HomeView/RecentItems.vue";

const description = `You can add tracks, albums and artists to your favorites by clicking the heart icon`;

const queue = useQueueStore();
const tracklist = useTracklist();

const recentFavs: Ref<RecentFavResult[]> = ref([]);
const favAlbums: Ref<Album[]> = ref([]);
const favTracks: Ref<Track[]> = ref([]);
const favArtists: Ref<Artist[]> = ref([]);

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
    })
    .then(() => {
      noFavs.value =
        !favAlbums.value.length &&
        !favTracks.value.length &&
        !favArtists.value.length;
    })
    .then(async () => {
      await nextTick();
      updateCardWidth();
    });
});

async function handlePlay(index: number) {
  const tracks = await getFavTracks(0);
  tracklist.setFromFav(tracks);
  queue.play(index);
}
</script>

<style lang="scss">
.favorites-page {
  height: 100%;
  overflow: auto;
  padding-bottom: 2rem;
  padding-right: 1rem;

  h3 {
    margin-top: 0;
  }

  .nothing h3 {
    margin-top: 3rem;
  }

  .fav-tracks {
    margin-bottom: 4rem;

    h3 {
      margin-top: 0;
    }

    .artist-top-tracks {
      margin-top: 0;
      padding-right: $small;

      h3 {
        padding-right: $smaller;
      }
    }
  }
}
</style>
