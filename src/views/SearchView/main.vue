<template>
  <div class="search-view content-page" style="padding-right: 0">
    <div class="buttons-area" v-if="isMobile">
      <Tabs
        :tabs="Object.values(pages)"
        :currentTab="($route.params.page as string)"
        @switchTab="(tab: string) => {
        $router.replace({ name: Routes.search, params: { page: tab }, query: {
          q: search.query,
        } });
        search.switchTab(tab);
      }"
      />
    </div>
    <div ref="page" class="page no-scroll" v-auto-animate>
      <component :is="component" />
    </div>
    <button
      v-if="$route.params.page !== 'tracks'"
      class="load-more"
      :class="{ load_disabled: !canLoadMore }"
      @click="canLoadMore && loadMore()"
    >
      Load more
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { Routes } from "@/router";
import { useRoute } from "vue-router";

import useSearchStore from "@/stores/search";
import { isMobile, isSmallPhone } from "@/stores/content-width";
import updatePageTitle from "@/utils/updatePageTitle";

import AlbumPage from "./albums.vue";
import ArtistPage from "./artists.vue";
import TracksPage from "./tracks.vue";
import Tabs from "@/components/RightSideBar/Search/TabsWrapper.vue";

const page = ref<HTMLElement>();

const search = useSearchStore();

enum pages {
  tracks = "tracks",
  albums = "albums",
  artists = "artists",
}

const route = useRoute();

const component = computed(() => {
  switch (route.params.page) {
    case pages.tracks:
      return TracksPage;
    case pages.albums:
      return AlbumPage;

    case pages.artists:
      return ArtistPage;

    default:
      return TracksPage;
  }
});

function loadTracks() {
  search.loadTracks();
}

function scrollToGridPageBottom() {
  const elem = document.getElementsByClassName("grid-page")[0] as HTMLElement;
  setTimeout(() => {
    elem.scroll({
      top: elem.scrollHeight,
      behavior: "smooth",
    });
  }, 250);
}

function loadAlbums() {
  search.loadAlbums();
  !isMobile.value && scrollToGridPageBottom();
}

function loadArtists() {
  search.loadArtists();

  !isMobile.value && scrollToGridPageBottom();
}

function loadMore() {
  switch (route.params.page) {
    case pages.tracks:
      loadTracks();
      break;
    case pages.albums:
      loadAlbums();
      break;

    case pages.artists:
      loadArtists();
      break;
    default:
      break;
  }
}

const canLoadMore = computed(() => {
  switch (route.params.page) {
    case pages.tracks:
      return search.tracks.more;
    case pages.albums:
      return search.albums.more;
    case pages.artists:
      return search.artists.more;
    default:
      false;
  }
});

onMounted(() => {
  updatePageTitle("Search");
  search.switchTab(route.params.page as string);
  search.query = route.query.q as string;
});
</script>

<style lang="scss">
.search-view {
  height: calc(100%);
  display: grid;
  margin-right: -0.75rem;
  position: relative;

  @include allPhones {
    display: grid;
    grid-template-rows: 3.5rem 1fr;
  }

  .page.no-scroll {
    overflow-x: visible;
    // @include hideScrollbars
  }

  .buttons-area {
    position: relative;
    // height: 4rem;

    .tabheaders {
      margin: 0;
    }
  }

  .grid-page {
    max-height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1.75rem 0;

    padding-bottom: 4rem;
    overflow: auto;
    padding-right: $medium;
    scrollbar-gutter: stable;
  }

  button.load-more {
    position: absolute;
    bottom: 0;
    height: 3rem;
    left: -1.25rem;
    width: calc(100% + 1.25rem);
    border-radius: 0;
    background: $darkestblue;
  }
}
</style>
