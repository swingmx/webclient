<template>
  <div id="folder-nav-title">
    <div class="folder">
      <div class="fname-wrapper">
        <div class="fname">
          <div
            class="icon image"
            @click="
              $router.push({ name: Routes.folder, params: { path: '$home' } })
            "
          ></div>
          <BreadCrumbNav :subPaths="subPaths" @navigate="navigate" />
        </div>
      </div>
      <SearchInput :page="Routes.folder" />
      <button
        class="toggle-list-mode"
        @click="settings.toggleFolderListMode"
        title="toggle list mode for folders"
        v-auto-animate
      >
        <GridSvg v-if="settings.folder_list_mode" />
        <ListSvg v-else />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { Routes } from "@/router";
import { subPath } from "@/interfaces";

import SearchInput from "@/components/shared/NavSearchInput.vue";
import BreadCrumbNav from "@/components/FolderView/BreadCrumbNav.vue";
import GridSvg from "@/assets/icons/grid.svg";
import ListSvg from "@/assets/icons/playlist.svg";
import useSettingsStore from "@/stores/settings";

const router = useRouter();
const settings = useSettingsStore();

defineProps<{
  subPaths: subPath[];
}>();

function navigate(path: string) {
  router.push({ name: Routes.folder, params: { path } });
}
</script>

<style lang="scss">
#folder-nav-title {
  width: 100%;

  .folder {
    display: grid;
    grid-template-columns: 1fr max-content max-content;

    .fname-wrapper {
      width: 100%;
      overflow: hidden;
    }

    .fname {
      background-color: $gray4;
      border-radius: $small;
      height: 2.25rem;
      display: flex;
      align-items: center;
      padding-right: $smaller;
      width: fit-content;
      max-width: 100%;
      overflow: scroll;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .icon {
        height: 2rem;
        aspect-ratio: 1;
        background-image: url("../../../assets/icons/folder.fill.svg");
        background-size: 1.5rem;
        margin-left: $smaller;
      }
    }

    .toggle-list-mode {
      margin-left: 1rem;
      height: 2.25rem;
      width: 2.25rem;
      aspect-ratio: 1;
      padding: 0;
    }
  }
}
</style>
