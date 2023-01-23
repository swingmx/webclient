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

import Content from "../components/SettingsView/Content.vue";
import { getRootDirs } from "@/composables/fetch/settings/rootdirs";
import useSettingsStore from "@/stores/settings";

const settings = useSettingsStore();

onMounted(() => getRootDirs().then((dirs) => settings.setRootDirs(dirs)));
</script>
