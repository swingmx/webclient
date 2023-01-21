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
      <button @click.prevent="modal.showRootDirsPromptModal" class="circular">
        Set Root Dirs
      </button>
      <SearchInput :page="Routes.folder" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchInput from "@/components/shared/NavSearchInput.vue";
import { subPath } from "@/interfaces";
import { Routes } from "@/router";
import { focusElemByClass } from "@/utils";
import { onUpdated } from "vue";

import useModalStore from "@/stores/modal";
import BreadCrumbNav from "@/components/FolderView/BreadCrumbNav.vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps<{
  subPaths: subPath[];
}>();

const modal = useModalStore();

onUpdated(() => {
  focusElemByClass("inthisfolder");
});

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
  }
}
</style>
