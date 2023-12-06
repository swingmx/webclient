<template>
  <div class="content-page favorites-page">
    <GenericHeader>
      <template #name>Favorites</template>
      <template #description
        >{{ count.tracks }} Tracks • {{ count.albums }} Albums • 
        {{ count.artists }} Artists</template
      >
    </GenericHeader>
    <CardScroller
      v-if="recentFavs.length"
      :items="recentFavs"
      :title="'Recent'"
    />
    <div v-if="favTracks.length" class="fav-tracks">
      <TopTracks
        :tracks="favTracks"
        :route="'/favorites/tracks'"
        :title="'Tracks'"
        :play-handler="handlePlay"
        :source="dropSources.favorite"
      />
    </div>
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

import { maxAbumCards, updateCardWidth } from "@/stores/content-width";
import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";

import { dropSources } from "@/enums";
import { Album, Artist, RecentFavResult, Track } from "@/interfaces";
import { getAllFavs, getFavTracks } from "@/requests/favorite";
import updatePageTitle from "@/utils/updatePageTitle";

import HeartSvg from "@/assets/icons/heart-no-color.svg";
import TopTracks from "@/components/ArtistView/TopTracks.vue";
import CardScroller from "@/components/shared/CardScroller.vue";
import NoItems from "@/components/shared/NoItems.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";

const description = `You can add tracks, albums and artists to your favorites by clicking the heart icon`;

const queue = useQueueStore();
const tracklist = useTracklist();

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

  .generichead {
    margin-bottom: 0;
    padding: 0 $small;
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
        padding-right: $smaller;
      }
    }
  }
}
</style>
