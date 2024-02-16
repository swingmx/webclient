<template>
  <div
    class="album-virtual-scroller v-scroll-page"
    :class="{ isSmall }"
    style="height: 100%"
  >
    <DynamicScroller
      id="album-scroller"
      style="height: 100%"
      class="scroller"
      :min-item-size="64"
      :items="scrollerItems"
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
            @playThis="playFromAlbum(item.props.track.master_index)"
          ></component>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";

import { Track } from "@/interfaces";

import useAlbumStore from "@/stores/pages/album";
import useQueueStore from "@/stores/queue";
import useTracklist from "@/stores/queue/tracklist";

import AlbumDiscBar from "@/components/AlbumView/AlbumDiscBar.vue";
import GenreBanner from "@/components/AlbumView/GenreBanner.vue";
import Header from "@/components/AlbumView/main.vue";
import AlbumsFetcher from "@/components/ArtistView/AlbumsFetcher.vue";
import CardScroller from "@/components/shared/CardScroller.vue";
import SongItem from "@/components/shared/SongItem.vue";

import { dropSources } from "@/enums";
import { isSmall } from "@/stores/content-width";

const album = useAlbumStore();
const queue = useQueueStore();
const tracklist = useTracklist();
const route = useRoute();

interface ScrollerItem {
  id: string | undefined;
  component:
    | typeof Header
    | typeof SongItem
    | typeof GenreBanner
    | typeof CardScroller
    | typeof AlbumsFetcher;
  props?: any;
}

class songItem {
  id: string | number;
  props = {};
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

const AlbumVersionsFetcher: ScrollerItem = {
  id: "otherVersionsFetcherBanner",
  component: AlbumsFetcher,
  props: {
    fetch_callback: album.fetchAlbumVersions,
    reset_callback: () => {
      album.resetOtherVersions();
      return album.fetchAlbumVersions();
    },
    name: "otherVersions",
  },
};

const fetched_similar_hash: ScrollerItem = {
  id: "similarAlbumsFetcherBanner",
  component: AlbumsFetcher,
  props: {
    fetch_callback: () => album.fetchSimilarAlbums(),
    reset_callback: () => {
      album.resetSimilarAlbums();
      return album.fetchSimilarAlbums();
    },
    name: "similarAlbums",
  },
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
      component: CardScroller,
      props: {
        items: ar.albums.map((album) => ({
          type: "album",
          item: album,
        })),
        title: `More from ${artistname}`,
        route: `/artists/${artisthash}/discography/all?artist=${artistname}`,
      },
    };
  });
}

function getAlbumVersionsComponent(): ScrollerItem | null {
  if (album.otherVersions.length == 0) return null;

  return {
    id: "otherVersions",
    component: CardScroller,
    props: {
      items: album.otherVersions.map((album) => ({
        type: "album",
        item: album,
      })),
      title: "Other versions",
      child_props: {
        hide_artists: true,
      },
      route: `/artists/${album.info.albumartists[0].artisthash}/discography/albums?artist=${album.info.albumartists[0].name}`,
    },
  };
}
const header: ScrollerItem = {
  id: "album-header",
  component: Header,
};

const genreBanner: ScrollerItem = {
  id: "genre-banner",
  component: GenreBanner,
  props: {
    source: "album",
  },
};

const scrollerItems = computed(() => {
  let moreFrom = getArtistAlbumComponents();
  moreFrom = moreFrom.filter((item) => item.id !== undefined);
  const otherVersionsComponent = getAlbumVersionsComponent();

  let components = [header, ...getSongItems(), genreBanner];

  if (album.tracks.length) {
    components.push(AlbumVersionsFetcher);
  }

  if (otherVersionsComponent !== null) {
    components.push(otherVersionsComponent);
  }

  components.push(...moreFrom);

  if (album.tracks.length) {
    components.push(fetched_similar_hash);
  }

  if (
    album.fetched_similar_hash === route.params.albumhash &&
    album.similarAlbums.length
  ) {
    components.push({
      id: "similarAlbums",
      component: CardScroller,
      props: {
        title: "Related Albums",
        items: album.similarAlbums.map((i) => ({
          type: "album",
          item: i,
        })),
      },
    });
  }

  return components;
});

function playFromAlbum(index: number) {
  const { title, albumhash } = album.info;
  tracklist.setFromAlbum(title, albumhash, album.srcTracks);
  queue.play(index);
}

onBeforeRouteUpdate(async (to) => {
  await album
    .fetchTracksAndArtists(to.params.albumhash.toString())
    .then(async () => {
      album.resetAlbumArtists();
      album.fetchArtistAlbums();

      await nextTick();

      document.getElementById("album-scroller")?.scrollTo({
        top: 0,
      });
    });
});

onBeforeRouteLeave(() => {
  album.resetAll();
});
</script>

<style lang="scss">
.album-virtual-scroller {
  height: 100%;
  overflow: visible;

  .songlist-item {
    grid-template-columns: 1.75rem 1fr 1fr 5.5rem;
  }
}
</style>
