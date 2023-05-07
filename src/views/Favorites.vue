<template>
  <div class="content-page favorites-page">
    <div class="fav-recents" v-if="recentFavs.length">
      <Recents :favs="recentFavs" />
    </div>
    <div class="fav-tracks" v-if="favTracks.length">
      <TopTracks
        :tracks="favTracks"
        :route="'/favorites/tracks'"
        :title="'Tracks ❤️'"
        :playHandler="handlePlay"
        :source="dropSources.favorite"
      />
    </div>
    <div class="fav-albums" v-if="favAlbums.length">
      <ArtistAlbums
        :albums="favAlbums"
        :albumType="discographyAlbumTypes.albums"
        :title="'Albums ❤️'"
        :route="'/favorites/albums'"
      />
    </div>

    <div class="fav-artists" v-if="favArtists.length">
      <FeaturedArtists
        :artists="favArtists"
        :title="'Artists ❤️'"
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
import { onMounted, Ref, ref } from "vue";

import useQueueStore from "@/stores/queue";
import { maxAbumCards } from "@/stores/content-width";

import { Album, Artist, RecentFavResult, Track } from "@/interfaces";
import { getAllFavs, getFavTracks } from "@/composables/fetch/favorite";
import { discographyAlbumTypes, dropSources } from "@/composables/enums";

import HeartSvg from "@/assets/icons/heart-no-color.svg";
import NoItems from "@/components/shared/NoItems.vue";
import Recents from "@/components/Favorites/Recents.vue";
import TopTracks from "@/components/ArtistView/TopTracks.vue";
import ArtistAlbums from "@/components/AlbumView/ArtistAlbums.vue";
import FeaturedArtists from "@/components/PlaylistView/ArtistsList.vue";

const description = `You can add tracks, albums and artists to your favorites by clicking the ❤️ heart icon`;

const queue = useQueueStore();

const recentFavs: Ref<RecentFavResult[]> = ref([]);
const favAlbums: Ref<Album[]> = ref([]);
const favTracks: Ref<Track[]> = ref([]);
const favArtists: Ref<Artist[]> = ref([]);

const noFavs = ref(false);

onMounted(() => {
  const max = maxAbumCards.value;
  getAllFavs(6, max, max)
    .then((favs) => {
      console.log(favs.recents);
      recentFavs.value = favs.recents;
      favAlbums.value = favs.albums;
      favTracks.value = favs.tracks;
      favArtists.value = favs.artists;
    })
    .then(() => {
      console.log(recentFavs.value);
      noFavs.value =
        !favAlbums.value.length &&
        !favTracks.value.length &&
        !favArtists.value.length;
    });
});

async function handlePlay(index: number) {
  const tracks = await getFavTracks(0);
  queue.playFromFav(tracks);
  queue.play(index);
}
</script>

<style lang="scss">
.favorites-page {
  height: 100%;
  overflow: auto;
  padding-bottom: 4rem;
  padding-right: 1rem;

  h3 {
    margin-top: 0;
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

  .fav-artists {
    h3 {
      padding-right: $medium;
    }
  }

  .fav-albums {
    .album-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    }
  }
}
</style>
