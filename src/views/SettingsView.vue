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

import useSettingsStore from "@/stores/settings";
import { getAllSettings } from "@/requests/settings";
import updatePageTitle from "@/utils/updatePageTitle";

import Content from "../components/SettingsView/Content.vue";

const store = useSettingsStore();

onMounted(() => {
  console.log("SettingsView mounted");
  updatePageTitle("Settings");
  getAllSettings().then(({ settings }) => {
    store.mapDbSettings(settings);
  });
});
</script>