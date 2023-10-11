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
          <BreadCrumbNav :sub-paths="subPaths" @navigate="navigate" />
        </div>
      </div>
      <SearchInput v-if="!isSmallPhone" :page="Routes.folder" />
      <button
        class="options"
        :class="{ 'btn-active': context_menu_showing }"
        title="show more options"
        @click="showContextMenu"
      >
        <MoreSvg />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import { Routes } from "@/router";
import { subPath } from "@/interfaces";
import { isSmallPhone } from "@/stores/content-width";

import SearchInput from "@/components/shared/NavSearchInput.vue";
import BreadCrumbNav from "@/components/FolderView/BreadCrumbNav.vue";
import MoreSvg from "@/assets/icons/more.svg";
import { showFolderContextMenu } from "@/helpers/contextMenuHandler";
import { ref } from "vue";
import { ContextSrc } from "@/enums";

const router = useRouter();
const route = useRoute();

const context_menu_showing = ref(false);

defineProps<{
  subPaths: subPath[];
}>();

function navigate(path: string) {
  router.push({ name: Routes.folder, params: { path } });
}

function showContextMenu(e: MouseEvent) {
  showFolderContextMenu(
    e,
    context_menu_showing,
    ContextSrc.FolderNav,
    route.params.path as string
  );
}
</script>

<style lang="scss">
#folder-nav-title {
  width: 100%;

  .folder {
    display: grid;
    grid-template-columns: 1fr max-content max-content;

    @include iphoneSE {
      grid-template-columns: 1fr max-content;
    }

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

    .options {
      margin-left: 1rem;
      height: 2.25rem;
      width: 2.25rem;
      aspect-ratio: 1;
      padding: 0;

      svg {
        transform: scale(1.2);
      }
    }
  }
}
</style>
