<template>
  <div class="settings-quickactions grid">
    <button
      v-for="a in actions"
      :key="a.label"
      class="qaction rounded-sm"
      @click="a.action"
    >
      <component :is="a.icon" v-if="a.icon" />
      <div class="label">{{ a.label }}</div>
      <Switch v-if="a.state" :state="a.state()" />
    </button>
  </div>
</template>

<script setup lang="ts">
import useSettings from "@/stores/settings";
import { triggerScan } from "@/requests/settings/rootdirs";

import Switch from "./Switch.vue";
import ReloadSvg from "@/assets/icons/reload.svg";

const settings = useSettings();

const actions = [
  {
    label: "Rescan library",
    action: triggerScan,
    icon: ReloadSvg,
  },
  {
    label: "Sidebar",
    action: settings.toggleDisableSidebar,
    state: () => settings.use_sidebar,
  },
  {
    label: "Silence skip",
    action: settings.toggleUseSilenceSkip,
    state: () => settings.use_silence_skip,
  },
  {
    label: "Crossfade",
    action: settings.toggleCrossfade,
    state: () => settings.use_crossfade,
  },
];
</script>

<style lang="scss">
.settings-quickactions.grid {
  gap: 1.25rem;
  padding-top: $medium;
  grid-template-columns: 1fr 1fr;

  .qaction {
    background-color: $gray5;
    padding: 1.5rem $small;
    font-size: 14px;
    border: solid 1px $gray4;
    // justify-content: space-between;

    gap: $smaller;

    &:hover {
      background-color: $gray4;
    }
  }

  .switch {
    transform: scale(0.8);
  }

  .qaction svg {
    transform: scale(0.75);
  }
  .qaction:nth-child(2) svg {
    transform: rotate(90deg);
  }
}
</style>
