<template>
  <div class="content-page favorites-page">
    <div class="fav-albums" v-if="favAlbums.length">
      <ArtistAlbums
        :albums="favAlbums"
        :albumType="discographyAlbumTypes.albums"
        :title="'Albums ❤️'"
        :route="'/favorites/albums'"
      />
    </div>
    <div class="fav-tracks" v-if="favTracks.length">
      <TopTracks
        :tracks="favTracks"
        :route="'/favorites/tracks'"
        :title="'Tracks ❤️'"
        :playHandler="handlePlay"
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

import ArtistAlbums from "@/components/AlbumView/ArtistAlbums.vue";
import TopTracks from "@/components/ArtistView/TopTracks.vue";
import FeaturedArtists from "@/components/PlaylistView/ArtistsList.vue";
import { discographyAlbumTypes } from "@/composables/enums";
import { getAllFavs, getFavTracks } from "@/composables/fetch/favorite";
import { Album, Artist, Track } from "@/interfaces";
import useQueueStore from "@/stores/queue";
import { maxAbumCards } from "@/stores/content-width";

import HeartSvg from "@/assets/icons/heart-no-color.svg";
import NoItems from "@/components/shared/NoItems.vue";

const description = `You can add tracks, albums and artists to your favorites by clicking the ❤️ heart icon`;

const queue = useQueueStore();

const favAlbums: Ref<Album[]> = ref([]);
const favTracks: Ref<Track[]> = ref([]);
const favArtists: Ref<Artist[]> = ref([]);

const noFavs = ref(false);

onMounted(() => {
  const max = maxAbumCards.value;
  getAllFavs(6, max, max)
    .then((favs) => {
      favAlbums.value = favs.albums;
      favTracks.value = favs.tracks;
      favArtists.value = favs.artists;
    })
    .then(() => {
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
