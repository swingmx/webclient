<template>
  <div class="nav-search-input">
    <Tabs
      v-if="!(content_width < 1100)"
      :tabs="tabs"
      :current-tab="($route.params.page as string)"
      @switchTab="(tab: string) => {
        $router.replace({ name: Routes.search, params: { page: tab }, query: {
          q: search.query,
        } });
        search.switchTab(tab);
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";

import { content_width } from "@/stores/content-width";
import useSearchStore from "@/stores/search";

import Tabs from "@/components/RightSideBar/Search/TabsWrapper.vue";

const search = useSearchStore();
const tabs = ["top", "tracks", "albums", "artists"];
</script>

<style lang="scss">
.nav-search-input {
  #right-tabs {
    position: relative;
  }
}
</style>
