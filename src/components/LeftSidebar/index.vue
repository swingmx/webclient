<template>
  <div class="l-sidebar no-scroll">
    <Logo />
    <div class="scrollable">
      <Navigation />
    </div>

    <NowPlayingImage v-if="settings.use_np_img" />
  </div>
</template>

<script setup lang="ts">
import Navigation from "@/components/LeftSidebar/Navigation.vue";
import Logo from "@/components/Logo.vue";
import NowPlayingImage from "./NowPlayingImg.vue";

import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore();
</script>

<style lang="scss">
.l-sidebar {
  width: 15rem;
  grid-area: l-sidebar;
  display: grid;
  grid-template-rows: 3.75rem 1fr 13rem;
  border-right: solid 1px $gray5;
  position: relative;
  padding: 1rem;
  gap: 1rem;

  .scrollable {
    height: 100%;
    overflow-y: scroll;
  }
}
</style>
