<template>
  <div
    class="settingspage content-page"
    style="height: 100%; overflow: auto; padding-right: 1.25rem"
  >
    <Content :current="0" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { getRootDirs } from "@/requests/settings/rootdirs";
import useSettingsStore from "@/stores/settings";
import updatePageTitle from "@/utils/updatePageTitle";
import Content from "../components/SettingsView/Content.vue";

const settings = useSettingsStore();

onMounted(() => {
  updatePageTitle("Settings");
  getRootDirs().then((dirs) => settings.setRootDirs(dirs));
});
</script>
