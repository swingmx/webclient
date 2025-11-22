<template>
  <div
    class="settingspage content-page"
    style="height: 100%; overflow: auto;"
  >
    <Content />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import useSettingsStore from "@/stores/settings";
import { getAllSettings } from "@/requests/settings";
import updatePageTitle from "@/utils/updatePageTitle";

import Content from "../components/SettingsView/Content.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const store = useSettingsStore();

onMounted(() => {
  updatePageTitle(t('Common.Settings'));
  getAllSettings().then(({ settings }) => {
    store.mapDbSettings(settings);
  });
});
</script>
