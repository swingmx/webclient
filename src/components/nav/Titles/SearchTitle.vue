<template>
  <div class="nav-search-input">
    <SearchInput :on_nav="true" />
    <div class="buttons-area" v-if="!isMobile">
      <Tabs
        :tabs="tabs"
        :currentTab="($route.params.page as string)"
        @switchTab="(tab: string) => {
        $router.replace({ name: Routes.search, params: { page: tab }, query: {
          q: search.query,
        } });
        search.switchTab(tab);
      }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";

import Tabs from "@/components/RightSideBar/Search/TabsWrapper.vue";
import SearchInput from "@/components/RightSideBar/SearchInput.vue";
import useSearchStore from "@/stores/search";
import { isMobile } from "@/stores/content-width";

const search = useSearchStore();
const tabs = ["tracks", "albums", "artists"];
</script>

<style lang="scss">
.nav-search-input {
  align-items: center;
  display: grid;
  grid-template-columns: minmax(14rem, 20rem) max-content;
  justify-content: space-between;
  gap: 2rem;

  @include allPhones {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .buttons-area {
    position: relative;
    height: 100%;
    width: 14rem;
  }

  #right-tabs {
    width: max-content;
    height: max-content;

    .tabheaders {
      height: 38px;
    }
  }

  .tabheaders {
    height: 2.25rem;
    margin: 0;
  }
}
</style>
