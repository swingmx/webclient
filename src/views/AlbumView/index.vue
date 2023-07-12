<template>
  <div class="album-virtual-scroller v-scroll-page" :class="{ isSmall }">
    <RecycleScroller
      class="scroller"
      :items="scrollerItems"
      :item-size="null"
      key-field="id"
      v-slot="{ item }"
    >
      <div :style="{ maxHeight: `${item.size}px` }">
        <component
          :is="item.component"
          v-bind="item.props"
          @playThis="playFromAlbum(item.props.track.master_index)"
        />
      </div>
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

import { Track } from "@/interfaces";

import useQueueStore from "@/stores/queue";
import useAlbumStore from "@/stores/pages/album";

import Header from "@/components/AlbumView/Header.vue";
import SongItem from "@/components/shared/SongItem.vue";
import GenreBanner from "@/components/AlbumView/GenreBanner.vue";
import AlbumDiscBar from "@/components/AlbumView/AlbumDiscBar.vue";
import AlbumsList from "@/components/AlbumView/ArtistAlbums.vue";
import AlbumsFetcher from "@/components/ArtistView/AlbumsFetcher.vue";
import SimilarAlbumLoader from "./SimilarAlbumLoader.vue";

import { isSmall, heightLarge, isSmallPhone } from "@/stores/content-width";
import { discographyAlbumTypes, dropSources } from "@/composables/enums";

const album = useAlbumStore();
const queue = useQueueStore();

interface ScrollerItem {
  id: string | undefined;
  component:
    | typeof Header
    | typeof SongItem
    | typeof GenreBanner
    | typeof AlbumsList
    | typeof AlbumsFetcher;
  props?: any;
  size: number;
}

class songItem {
  id: string | number;
  props = {};
  size = 64;
  component: typeof SongItem | typeof AlbumDiscBar;

  constructor(track: Track) {
    this.id = track.filepath || Math.random();
    this.props = track.is_album_disc_number
      ? { album_disc: track }
      : {
          track,
          hide_album: true,
          index: track.track,
          source: dropSources.album,
        };
    this.component = track.is_album_disc_number ? AlbumDiscBar : SongItem;
  }
}

const genreBanner: ScrollerItem = {
  id: "genre-banner",
  component: GenreBanner,
  size: 80,
};

const AlbumVersionsFetcher: ScrollerItem = {
  id: "otherVersionsFetcherBanner",
  component: AlbumsFetcher,
  props: {
    fetch_callback: album.fetchAlbumVersions,
    reset_callback: () => {
      album.resetOtherVersions();
      album.fetchAlbumVersions();
    },
    clear_callback: album.resetOtherVersions,
  },
  size: 2,
};

const SimilarAlbumsFetcher: ScrollerItem = {
  id: "similarAlbumsFetcherBanner",
  component: AlbumsFetcher,
  props: {
    fetch_callback: album.fetchSimilarAlbums,
    reset_callback: () => {
      album.resetSimilarAlbums();
      album.fetchSimilarAlbums();
    },
    clear_callback: album.resetSimilarAlbums,
  },
  size: 2,
};

function getSongItems() {
  return album.tracks.map((track) => {
    return new songItem(track);
  });
}

function getArtistAlbumComponents(): ScrollerItem[] {
  return album.albumArtists.map((ar) => {
    const artist = album.info.albumartists.find(
      (a) => a.artisthash === ar.artisthash
    );
    const artistname = artist?.name;
    const artisthash = artist?.artisthash;

    return {
      id: artisthash,
      component: AlbumsList,
      props: {
        artisthash,
        albums: ar.albums,
        title: `More from ${artistname}`,
        albumType: discographyAlbumTypes.all,
        route: `/artists/${artisthash}/discography`,
      },
      size: 19 * 16,
    };
  });
}

function getAlbumVersionsComponent(): ScrollerItem | null {
  if (album.otherVersions.length == 0) return null;

  return {
    id: "otherVersions",
    component: AlbumsList,
    props: {
      artisthash: album.info.albumartists[0].artisthash,
      albums: album.otherVersions,
      title: "Other versions",
      albumType: discographyAlbumTypes.albums,
      route: `/artists/${album.info.albumartists[0].artisthash}/discography`,
      hide_artists: true,
    },
    size: 18 * 16,
  };
}

const scrollerItems = computed(() => {
  const header: ScrollerItem = {
    id: "album-header",
    component: Header,
    size: isSmallPhone.value || heightLarge.value ? 25 * 16 : 19 * 16,
    // size: (!isSmallPhone.value) || heightLarge.value ? 25 * 16 : 19 * 16,
  };

  let moreFrom = getArtistAlbumComponents();
  moreFrom = moreFrom.filter((item) => item.id !== undefined);
  const otherVersionsComponent = getAlbumVersionsComponent();

  let components = [
    header,
    ...getSongItems(),
    genreBanner,
    AlbumVersionsFetcher,
  ];

  if (otherVersionsComponent !== null) {
    components.push(otherVersionsComponent);
  }

  components.push(...moreFrom);
  components.push(SimilarAlbumsFetcher);

  if (album.similarAlbums.length > 0) {
    components.push({
      id: "similarAlbums",
      component: SimilarAlbumLoader,
      size: 19 * 16,
    });
  }

  return components;
});

function playFromAlbum(index: number) {
  const { title, albumhash } = album.info;
  queue.playFromAlbum(title, albumhash, album.srcTracks);
  queue.play(index);
}

onBeforeRouteUpdate(async (to) => {
  await album.fetchTracksAndArtists(to.params.albumhash.toString()).then(() => {
    album.resetQuery();
    album.resetAlbumArtists();
    album.fetchArtistAlbums();
  });
});

onBeforeRouteLeave(() => {
  setTimeout(() => {
    album.resetQuery();
    album.resetAlbumArtists();
  }, 500);
});
</script>

<style lang="scss">
.album-virtual-scroller {
  height: 100%;
  overflow: visible;

  .songlist-item {
    grid-template-columns: 1.75rem 1.5fr 1fr 5.5rem;
  }
}
</style>
