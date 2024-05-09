<template>
  <div class="r-sidebar">
    <SearchInput />
    <div v-auto-animate class="r-content no-scroll">
      <div v-if="tabs.current === tabs.tabs.home" class="r-dash">
        <DashBoard />
      </div>
      <div v-if="tabs.current === tabs.tabs.search" class="r-search">
        <Search />
      </div>
      <div v-if="tabs.current === tabs.tabs.queue" class="r-queue">
        <Queue />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useTabStore from "@/stores/tabs";

import DashBoard from "./Home/Main.vue";
import Queue from "./Queue.vue";
import Search from "./Search/Main.vue";
import SearchInput from "./SearchInput.vue";

const tabs = useTabStore();
</script>

<style lang="scss">
.r-sidebar {
  width: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
  background-color: rgb(22, 22, 22);
  padding-bottom: 1rem;
  border-top: none;
  border-bottom: none;
  margin-bottom: -1rem;

  .gsearch-input {
    height: 2.5rem;
    margin: 1rem;
  }

  .r-content {
    width: 100%;
    height: 100%;
    background-color: $gray;

    .r-search {
      height: 100%;
    }

    .r-dash {
      height: 100%;
    }

    .r-queue {
      height: 100%;
      overflow: hidden;
      display: grid;
      gap: $small;
      grid-template-rows: max-content 1fr;
    }
  }
}

.designatedOS .r-sidebar > .r-content > .r-queue > .queue-virtual-scroller > .scroller::-webkit-scrollbar-track {
  background-color: $gray;
}

.designatedOS .r-sidebar > .r-content > .r-queue > .queue-virtual-scroller > .scroller::-webkit-scrollbar-thumb {
  border: 4px solid $gray;
}
</style>
