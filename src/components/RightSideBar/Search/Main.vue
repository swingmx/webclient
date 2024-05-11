<template>
  <div class="right-search">
    <TabsWrapper :tabs="tabs" :current-tab="currentTab" :tab-content="true" @switchTab="switchTab">
      <Tab :name="currentTab" />
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import useSearchStore from "@/stores/search";
import Tab from "./Tab.vue";
import TabsWrapper from "./TabsWrapper.vue";

const search = useSearchStore();

const tabs = ["top", "tracks", "albums", "artists"];

const currentTab = ref("top");

function switchTab(tab: string) {
  currentTab.value = tab;
  search.switchTab(tab);
}
</script>

<style lang="scss">
.right-search {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;

  .tabheaders {
    padding: 1rem;
    max-width: 100%;
    overflow: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .input {
    display: flex;
    align-items: center;
    position: relative;
  }
}
</style>
