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
      <BalancerProvider>
        <router-view />
      </BalancerProvider>
    </div>
    <RightSideBar v-if="settings.use_sidebar && xl" />
    <BottomBar />
    <!-- <BubbleManager /> -->
  </section>
</template>

<script setup lang="ts">
// @libraries
import { vElementSize } from "@vueuse/components";
import { onStartTyping } from "@vueuse/core";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { BalancerProvider } from "vue-wrap-balancer";

// @stores
import {
  content_height,
  content_width,
  isMobile,
} from "@/stores/content-width";
import useLyrics from "@/stores/lyrics";
import useModal from "@/stores/modal";
import useQueue from "@/stores/queue";
import useSettings from "@/stores/settings";

// @utils
import handleShortcuts from "@/helpers/useKeyboard";
import { readLocalStorage, writeLocalStorage } from "@/utils";
import { xl, xxl } from "./composables/useBreakpoints";

// @small-components
import ContextMenu from "@/components/ContextMenu.vue";
import Modal from "@/components/modal.vue";
import Notification from "@/components/Notification.vue";

// @app-grid-components
import BottomBar from "@/components/BottomBar/BottomBar.vue";
import LeftSidebar from "@/components/LeftSidebar/index.vue";
import NavBar from "@/components/nav/NavBar.vue";
import RightSideBar from "@/components/RightSideBar/Main.vue";
import { getAllSettings } from "@/requests/settings";

import { getRootDirs } from "@/requests/settings/rootdirs";
// import BubbleManager from "./components/bubbles/BinManager.vue";

const queue = useQueue();
const modal = useModal();
const lyrics = useLyrics();
const router = useRouter();
const settings = useSettings();

handleShortcuts(useQueue, useModal);

router.afterEach(() => {
  (document.getElementById("acontent") as HTMLElement).scrollTo(0, 0);
});

onStartTyping(() => {
  if (isMobile.value) return;

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
  settings.initializeVolume();

  handleRootDirsPrompt();

  getAllSettings()
    .then(({ settings: data }) => {
      settings.mapDbSettings(data);
    })
    .then(() => {
      if (settings.use_lyrics_plugin) return;
    });

  if (queue.currenttrack) {
    lyrics.checkExists(
      queue.currenttrack.filepath,
      queue.currenttrack.trackhash
    );
  }
});
</script>

<style lang="scss">
@import "./assets/scss/mixins.scss";

.r-sidebar {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
