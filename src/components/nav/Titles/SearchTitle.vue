<template>
  <div class="nav-search-input">
    <SearchInput :on_nav="true" />
    <Tabs
      v-if="!isMobile"
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

import Tabs from "@/components/RightSideBar/Search/TabsWrapper.vue";
import SearchInput from "@/components/RightSideBar/SearchInput.vue";
import useSearchStore from "@/stores/search";
import { isMobile } from "@/stores/content-width";

const search = useSearchStore();
const tabs = ["top", "tracks", "albums", "artists"];
</script>

<style lang="scss">
.nav-search-input {
  align-items: center;
  display: grid;
  grid-template-columns: minmax(10rem, 20rem) max-content;
  justify-content: space-between;
  gap: 1rem;

  @include allPhones {
    grid-template-columns: 1fr;
    gap: 0;
  }

  #right-tabs {
    position: relative;
  }
}
</style>
