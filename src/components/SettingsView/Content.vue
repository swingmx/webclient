<template>
  <div class="settingscontent">
    <GenericHeader>
      <template #name>Settings</template>
      <template #description>
        Customize your settings and preferences
      </template>
    </GenericHeader>
    <Group
      v-for="(group, index) in settingGroups[current].groups"
      :key="index"
      :group="group"
    />
    <div class="version t-center">
      <LogoSvg /> <span>Swing Music - v{{ VERSION }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VERSION } from "@/config";
import settingGroups from "@/settings";

import Group from "./Group.vue";
import GenericHeader from "@/components/Radios/GenericHeader.vue";
import LogoSvg from "@/assets/icons/logo.svg";

defineProps<{
  current: number;
}>();
</script>

<style lang="scss">
.settingscontent {
  width: 35rem;
  max-width: 100%;
  padding-bottom: 2rem;

  .version {
    margin: 2rem auto;
    color: $gray1;
    height: 3rem;
    width: max-content;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>
