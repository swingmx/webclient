<template>
  <div
    class="topnav"
    :class="{
      use_links: settings.is_alt_layout,
      use_sidebar: settings.use_sidebar && isSmall,
    }"
  >
    <div class="left">
      <NavButtons />
      <NavLinks v-if="settings.is_alt_layout" />
      <div v-if="settings.is_default_layout && $route.name == Routes.folder" class="info">
        <Folder :sub-paths="subPaths" />
      </div>
      <NavTitles v-else-if="settings.is_default_layout && !isSmall" />
    </div>
    <div class="sidenav_toggle" @click="toggleSidenav">
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <NavSidenav @close="toggleSidenav" :class="{ active: sidenavActive }" />
    <div class="dimmer noSelect" :class="{ active: sidenavActive }" @click="toggleSidenav"></div>
    <RouterLink v-if="settings.is_alt_layout" to="/" class="logo rounded-sm"><LogoSvg /></RouterLink>
    <div v-if="settings.is_alt_layout || !settings.use_sidebar || !xl" class="right">
      <SearchInput :on_nav="true" />
      <!-- v-if="settings.is_alt_layout" -->
      <RouterLink
        :to="{
          name: Routes.settings,
          params: {
            tab: 'general',
          },
        }"
        class="avatar"
      >
        <AvatarSvg />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { subPath } from "@/interfaces";
import { content_width } from "@/stores/content-width";
import useSettings from "@/stores/settings";
import { createSubPaths } from "@/utils";
import { xl } from "./../../composables/useBreakpoints";

import LogoSvg from "@/assets/icons/logos/logo-fill.light.svg";
import AvatarSvg from "@/assets/icons/settings.svg";
import SearchInput from "../RightSideBar/SearchInput.vue";
import NavButtons from "./NavButtons.vue";
import NavLinks from "./NavLinks.vue";
import NavSidenav from "./NavSidenav.vue";
import NavTitles from "./NavTitles.vue";
import Folder from "./Titles/Folder.vue";

const settings = useSettings();
const isSmall = computed(() => content_width.value < 800);

const route = useRoute();
const subPaths = ref<subPath[]>([]);

let oldpath = "";

watch(
  () => route.name,
  (newRoute) => {
    switch (newRoute) {
      case Routes.folder: {
        [oldpath, subPaths.value] = createSubPaths(route.params.path as string, oldpath);

        watch(
          () => route.params.path,
          (newPath) => {
            newPath = newPath as string;
            if (newPath == undefined) return;

            [oldpath, subPaths.value] = createSubPaths(newPath, oldpath);
          }
        );
        break;
      }
      default:
        break;
    }
  }
);

onMounted(() => {
  if (route.name == Routes.folder) {
    [oldpath, subPaths.value] = createSubPaths(route.params.path as string, oldpath);
  }
});

const sidenavActive = ref(false);

function toggleSidenav() {
  sidenavActive.value = !sidenavActive.value;
}
</script>

<style lang="scss">
.topnav {
  display: grid;
  grid-template-columns: 1fr max-content;

  input {
    min-width: 6rem;
  }

  align-items: center;
  gap: 1rem;
  font-size: 14px;

  &.use_links {
    grid-template-columns: 1fr max-content 1fr;
  }

  .left {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 1rem;

    .info {
      margin: auto 0;
      width: fit-content;
      overflow: hidden;

      .title {
        font-size: 1.5rem;
        font-weight: 700;
        display: flex;
        align-items: center;
      }
    }

    @include allPhones {
      display: none;
    }
  }

  .logo {
    width: max-content;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    align-items: center;
    width: 100%;

    .avatar {
      height: 2.25rem;
      aspect-ratio: 1;
      background-color: $gray4;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s ease-out, color 0.2s ease-out;

      display: grid;
      place-items: center;

      svg {
        transform: scale(0.75);
        color: $gray1;
      }

      &:hover {
        background-color: #fff;

        svg {
          color: #000;
          transform: scale(0.75);
        }
      }

      @include allPhones {
        height: unset;
        background-color: transparent;
      }
    }

    @include allPhones {
      gap: unset;
      justify-content: unset;
    }
  }

  @include allPhones {
    display: flex;
  }
}
</style>
