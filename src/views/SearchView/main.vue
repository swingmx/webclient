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
import { isMobile } from "@/stores/content-width";
import updatePageTitle from "@/utils/updatePageTitle";

import CardGridPage from "./CardGridPage.vue";
import TracksPage from "./tracks.vue";
import TopResults from "./TopResults.vue";
import Tabs from "@/components/RightSideBar/Search/TabsWrapper.vue";

const search = useSearchStore();

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
        props: { page: "album", items: search.albums.value },
      };

    case pages[3]:
      return {
        component: CardGridPage,
        props: { page: "artist", items: search.artists.value },
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
  display: grid;
  position: relative;

  @include allPhones {
    display: grid;
    grid-template-rows: 3.5rem 1fr;
  }

  .buttons-area {
    position: relative;
    padding-left: $padleft;

    .tabheaders {
      margin: 0;
    }
  }
}
</style>
