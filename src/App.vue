<template>
  <ContextMenu />
  <Modal />
  <Notification />
  <div id="drag-img" class="ellip2" style=""></div>
  <section
    id="app-grid"
    :class="{
      noSidebar: !settings.use_sidebar || !xl,
      NoSideBorders: !xxl,
      extendWidth: settings.extend_width && settings.can_extend_width,
    }"
    :style="{ maxWidth: `${content_height > 1080 ? '2220px' : '1720px'}` }"
  >
    <LeftSidebar v-if="!isMobile" />
    <NavBar />
    <div id="acontent" v-element-size="updateContentElemSize">
      <router-view />
    </div>
    <RightSideBar v-if="settings.use_sidebar && xl" />
    <BottomBar />
    <!-- <BubbleManager /> -->
  </section>
</template>

<script setup lang="ts">
// @libraries
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { onStartTyping } from "@vueuse/core";
import { vElementSize } from "@vueuse/components";
// @stores
import {
  content_width,
  content_height,
  isMobile,
} from "@/stores/content-width";
import useModalStore from "@/stores/modal";
import useQStore from "@/stores/queue";
import useSettingsStore from "@/stores/settings";

// @utils
import handleShortcuts from "@/composables/useKeyboard";
import { readLocalStorage, writeLocalStorage } from "@/utils";
import { xl, xxl } from "./composables/useBreakpoints";

// @small-components
import ContextMenu from "@/components/ContextMenu.vue";
import Modal from "@/components/modal.vue";
import Notification from "@/components/Notification.vue";

// @app-grid-components
import BottomBar from "@/components/BottomBar/BottomBar.vue";
import NavBar from "@/components/nav/NavBar.vue";
import RightSideBar from "@/components/RightSideBar/Main.vue";
import LeftSidebar from "./components/NavBar/index.vue";

import { baseApiUrl } from "./config";
import { getRootDirs } from "./composables/fetch/settings/rootdirs";
// import BubbleManager from "./components/bubbles/BinManager.vue";

const queue = useQStore();
const router = useRouter();
const modal = useModalStore();
const settings = useSettingsStore();

queue.readQueue();
handleShortcuts(useQStore, useModalStore);

router.afterEach(() => {
  (document.getElementById("acontent") as HTMLElement).scrollTo(0, 0);
});

onStartTyping((e) => {
  const elem = document.getElementById("globalsearch") as HTMLInputElement;
  elem.focus();
  elem.value = "";
});

function updateContentElemSize({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  content_width.value = width;
  content_height.value = height;
}

function handleWelcomeModal() {
  let welcomeShowCount = readLocalStorage("shown-welcome-message");

  if (!welcomeShowCount) {
    welcomeShowCount = 0;
  }

  if (welcomeShowCount < 2) {
    modal.showWelcomeModal();
    writeLocalStorage("shown-welcome-message", welcomeShowCount + 1);
  }
}

function handleRootDirsPrompt() {
  getRootDirs().then((dirs) => {
    if (dirs.length === 0) {
      modal.showRootDirsPromptModal();
    } else {
      settings.setRootDirs(dirs);
    }
  });
}

onMounted(() => {
  handleWelcomeModal();

  if (baseApiUrl.value === null) {
    modal.showSetIPModal();
    return;
  }

  handleRootDirsPrompt();
});
</script>

<style lang="scss">
@import "./assets/scss/mixins.scss";

.l-sidebar {
  position: relative;

  .withlogo {
    padding: 1rem;
  }

  .l-album-art {
    width: calc(100% - 2rem);
    position: absolute;
    bottom: 0;
    margin-bottom: 1rem;
  }
}

.r-sidebar {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
