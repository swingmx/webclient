<template>
  <div class="search-view" :class="{ is_alt_layout }">
    <div v-if="is_alt_layout" class="buttons-area">
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
    <div v-auto-animate class="page no-scroll">
      <component :is="component.component" v-bind="component.props" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";

import useSearchStore from "@/stores/search";
import useSettings from "@/stores/settings";
import { content_width } from "@/stores/content-width";
import updatePageTitle from "@/utils/updatePageTitle";

import TracksPage from "./tracks.vue";
import TopResults from "./TopResults.vue";
import CardGridPage from "./CardGridPage.vue";
import Tabs from "@/components/RightSideBar/Search/TabsWrapper.vue";

const settings = useSettings();
const search = useSearchStore();

const is_alt_layout = computed(
  () => settings.is_alt_layout || content_width.value < 800
);

const pages = ["top", "tracks", "albums", "artists"];

const route = useRoute();

const component = computed(() => {
  switch (route.params.page) {
    case pages[0]:
      return { component: TopResults };
    case pages[1]:
      return { component: TracksPage };
    case pages[2]:
      return {
        component: CardGridPage,
        props: {
          page: "album",
          items: search.albums.value,
          fetch_callback: search.loadAlbums,
        },
      };

    case pages[3]:
      return {
        component: CardGridPage,
        props: {
          page: "artist",
          items: search.artists.value,
          fetch_callback: search.loadArtists,
        },
      };

    default:
      return TracksPage;
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
  position: relative;
  display: grid;

  .buttons-area {
    position: relative;
    padding-left: $padleft;

    .tabheaders {
      margin: 0;
    }
  }

  &.is_alt_layout {
    grid-template-rows: 2rem 1fr;
    gap: 1rem;
    padding-top: 1rem;

    .vue-recycle-scroller {
      padding-top: 0 !important;
    }
  }
}
</style>
