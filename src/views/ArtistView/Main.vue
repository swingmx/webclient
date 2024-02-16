<template>
  <div class="artist-page v-scroll-page" style="height: 100%">
    <DynamicScroller
      id="artist-scroller"
      :items="scrollerItems"
      :min-item-size="64"
      class="scroller"
      style="height: 100%"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.props]"
          :data-index="index"
        >
          <component
            :is="item.component"
            :key="index"
            v-bind="item.props"
          ></component>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";

import useArtist from "@/stores/pages/artist";
import useQueue from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";

import { discographyAlbumTypes, dropSources } from "@/enums";
import { Album, ScrollerItem } from "@/interfaces";
import { getArtistTracks } from "@/requests/artists";

import GenreBanner from "@/components/AlbumView/GenreBanner.vue";
import ArtistAlbumsFetcher from "@/components/ArtistView/AlbumsFetcher.vue";
import Header from "@/components/ArtistView/Header.vue";
import TopTracks from "@/components/ArtistView/TopTracks.vue";
import CardScroller from "@/components/shared/CardScroller.vue";

const route = useRoute();

const queue = useQueue();
const store = useArtist();
const tracklist = useTracklist();

function fetchArtistAlbums() {
  return store.getArtistAlbums();
}

function reFetchArtistAlbums() {
  store.resetAlbums();
  return store.getArtistAlbums();
}

function fetchSimilarArtists() {
  return store.fetchSimilarArtists();
}

function reFetchSimilarArtists() {
  store.resetSimilarArtists();
  return store.fetchSimilarArtists();
}

function getHeader() {
  return <ScrollerItem>{
    id: "artist-header",
    component: Header,
  };
}

const artist_albums_fetcher: ScrollerItem = {
  id: "artist-albums-fetcher",
  component: ArtistAlbumsFetcher,
  props: {
    fetch_callback: fetchArtistAlbums,
    reset_callback: reFetchArtistAlbums,
  },
};

const similar_artists_fetcher: ScrollerItem = {
  id: "similar-artist-fetcher",
  component: ArtistAlbumsFetcher,
  props: {
    fetch_callback: fetchSimilarArtists,
    reset_callback: reFetchSimilarArtists,
  },
};

enum AlbumType {
  ALBUMS = "Albums",
  SINGLES = "EP & Singles",
  APPEARANCES = "Appearances",
  COMPILATIONS = "Compilations",
}

function createAbumComponent(
  title: AlbumType,
  albums: Album[],
  show_date = true
) {
  let albumType = null;

  switch (title) {
    case AlbumType.ALBUMS:
      albumType = discographyAlbumTypes.albums;
      break;
    case AlbumType.SINGLES:
      albumType = discographyAlbumTypes.EPs_and_singles;
      break;
    case AlbumType.COMPILATIONS:
      albumType = discographyAlbumTypes.compilations;
      break;
    case AlbumType.APPEARANCES:
      albumType = discographyAlbumTypes.appearances;
      break;

    default:
      break;
  }
  return {
    id: title,
    component: CardScroller,
    props: {
      title,
      items: albums.map((album) => ({
        type: "album",
        item: album,
      })),
      child_props: {
        show_date,
        artist_page: true,
        hide_artists: !(AlbumType.APPEARANCES === title),
      },
      route: `/artists/${store.info.artisthash}/discography/${albumType}?artist=${store.info.name}`,
    },
  };
}

function getTopTracksComponent(): ScrollerItem {
  return {
    id: "artist-top-tracks",
    component: TopTracks,
    props: {
      tracks: store.tracks,
      title: "Tracks",
      route: `/artists/${store.info.artisthash}/tracks?artist=${store.info.name}`,
      playHandler: handlePlay,
      source: dropSources.artist,
    },
  };
}

const scrollerItems = computed(() => {
  const genreBanner = <ScrollerItem>{
    id: "artist-genres",
    component: GenreBanner,
    props: {
      source: "artist",
    },
  };
  let components = [getHeader()];

  if (store.tracks.length > 0) {
    components.push(getTopTracksComponent());
  }

  components = [...components, artist_albums_fetcher];

  if (store.albums.length > 0) {
    const albums = createAbumComponent(AlbumType.ALBUMS, store.albums);
    components.push(albums);
  }

  if (store.singles.length > 0) {
    const singles = createAbumComponent(AlbumType.SINGLES, store.singles);
    components.push(singles);
  }

  if (store.compilations.length > 0) {
    const compilations = createAbumComponent(
      AlbumType.COMPILATIONS,
      store.compilations
    );
    components.push(compilations);
  }

  if (store.appearances.length > 0) {
    const appearances = createAbumComponent(
      AlbumType.APPEARANCES,
      store.appearances,
      false
    );
    components.push(appearances);
  }

  components = [...components, genreBanner];

  if (store.tracks.length) {
    components.push(similar_artists_fetcher);
  }

  if (
    store.fetched_similar_hash === route.params.hash &&
    store.similar_artists.length > 0
  ) {
    const SimilarArtistsComponent = {
      id: "similar-artists",
      component: CardScroller,
      props: {
        items: store.similar_artists.map((artist) => ({
          type: "artist",
          item: artist,
        })),
        title: "Similar Artists",
      },
    };
    components.push(SimilarArtistsComponent);
  }

  return components;
});

async function handlePlay(index: number) {
  const tracks = await getArtistTracks(store.info.artisthash);
  tracklist.setFromArtist(store.info.artisthash, store.info.name, tracks);
  queue.play(index);
}

onBeforeRouteUpdate(async (to) => {
  // fetch data and scroll to top
  await store.getData(to.params.hash as string).then(async () => {
    await nextTick();

    document.getElementById("artist-scroller")?.scrollTo({
      top: 0,
    });
  });
});

onBeforeRouteLeave(() => store.resetAll());
</script>

<style lang="scss">
.artist-page {
  .card-list-scroll-x {
    padding-top: 1rem;
  }

  .section-title {
    padding-left: 1rem;
  }
}
</style>
