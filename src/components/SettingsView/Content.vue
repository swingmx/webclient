<template>
  <div class="settingscontent">
    <GenericHeader>
      <template #name>Settings</template>
      <template #description>
        Customize your settings and preferences
      </template>
    </GenericHeader>
    <GenericTabs
      :items="
        settingGroups.map((g) => ({
          title: g.title,
          params: {
            tab: g.title.toLowerCase(),
          },
        }))
      "
      :active="(item) => item.title === currentTab?.title"
      :route="Routes.settings"
    />
    <Group
      v-for="(group, index) in currentTab?.groups"
      :key="index"
      :group="group"
    />
    <About v-if="currentTab?.title === 'About'" />
    <div class="version t-center">
      <b>Swing Music - v{{ settings.version }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Routes } from "@/router";
import { useRoute } from "vue-router";

import settingGroups from "@/settings";
import useSettings from "@/stores/settings";

import Group from "./Group.vue";
import About from "./About.vue";
import GenericTabs from "@/components/shared/GenericTabs.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";

const route = useRoute();
const settings = useSettings();

const currentTab = computed(() => {
  const tab = route.params.tab;
  return settingGroups.find((group) => group.title.toLowerCase() === tab);
});
</script>

<style lang="scss">
.settingscontent {
  width: 31rem;
  max-width: 100%;

  .version {
    margin: 2rem auto;
    width: max-content;
    opacity: 0.5;
    font-size: 14px;
  }
}
</style>
