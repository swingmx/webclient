<template>
  <div class="search-view">
    <div v-if="isMobile" class="buttons-area">
      <Tabs
        :tabs="pages"
        :current-tab="($route.params.page as string)"
        @switchTab="(tab: string) => {
        $router.replace({ name: Routes.search, params: { page: tab }, query: {
          q: search.query,
        } });
        search.switchTab(tab);
      }"
      />
    </div>
    <div ref="page" v-auto-animate class="page no-scroll">
      <component :is="component" />
    </div>
    <button
      v-if="$route.params.page !== 'tracks' && $route.params.page !== 'top'"
      class="load-more"
      :class="{ load_disabled: !canLoadMore }"
      @click="canLoadMore && loadMore()"
    >
      Load more
    </button>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";

import useSearchStore from "@/stores/search";
import { isMobile } from "@/stores/content-width";
import updatePageTitle from "@/utils/updatePageTitle";

import AlbumPage from "./albums.vue";
import ArtistPage from "./artists.vue";
import TracksPage from "./tracks.vue";
import TopResults from "./TopResults.vue";
import Tabs from "@/components/RightSideBar/Search/TabsWrapper.vue";

const page = ref<HTMLElement>();

const search = useSearchStore();

const pages = ["top", "tracks", "albums", "artists"];

const route = useRoute();

const component = computed(() => {
  switch (route.params.page) {
    case pages[0]:
      return TopResults;
    case pages[1]:
      return TracksPage;
    case pages[2]:
      return AlbumPage;

    case pages[3]:
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
    case pages[1]:
      loadTracks();
      break;
    case pages[2]:
      loadAlbums();
      break;

    case pages[3]:
      loadArtists();
      break;
    default:
      break;
  }
}

const canLoadMore = computed(() => {
  switch (route.params.page) {
    case pages[1]:
      return search.tracks.more;
    case pages[2]:
      return search.albums.more;
    case pages[3]:
      return search.artists.more;
    default:
      return false;
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
  height: 100%;
  display: grid;
  position: relative;

  @include allPhones {
    display: grid;
    grid-template-rows: 3.5rem 1fr;
  }

  .page.no-scroll {
    overflow-x: visible;
  }

  .buttons-area {
    position: relative;
    .tabheaders {
      margin: 0;
    }
  }

  .grid-page {
    padding-right: $padright;
    padding-bottom: calc($padbottom * 1.5);
    max-height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1.75rem 0;

    overflow: auto;
    scrollbar-gutter: stable;
  }

  button.load-more {
    position: absolute;
    bottom: 0;
    height: 3rem;
    left: calc(0rem - $padleft);
    width: calc(100% + $padleft);
    border-radius: 0;
    background: $darkestblue;
  }
}
</style>
