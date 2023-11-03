<template>
  <div class="settingscontent">
    <GenericHeader>
      <template #name>Settings</template>
      <template #description>
        Customize your settings and preferences
      </template>
    </GenericHeader>
    <div class="s-tabs">
      <div
        v-for="(group, index) in settingGroups"
        :key="index"
        class="tab"
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        {{ group.title }}
        <div class="indicator"></div>
      </div>
    </div>
    <Group
      v-for="(group, index) in settingGroups[currentTab].groups"
      :key="index"
      :group="group"
    />
    <div class="version t-center">
      <LogoSvg /> <span>Swing Music - v{{ VERSION }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VERSION } from "@/config";
import settingGroups from "@/settings";

import Group from "./Group.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";
import LogoSvg from "@/assets/icons/logos/logo-light.svg";

const currentTab = ref(1);
</script>

<style lang="scss">
.settingscontent {
  width: 35rem;
  max-width: 100%;
  padding-bottom: 2rem;

  .s-tabs {
    display: flex;
    border-bottom: solid 1px $gray;

    .tab {
      padding: $medium;
      position: relative;
      color: $gray1;
    }

    .indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background-color: $white;
      height: 3px;
      border-radius: 1rem;
      opacity: 0;
    }

    .tab.active {
      color: $white;

      .indicator {
        width: 3rem;
        opacity: 1;
      }
    }
  }

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
