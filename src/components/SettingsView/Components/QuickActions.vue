<template>
  <div class="settings-quickactions flex">
    <button
      v-for="a in actions"
      :key="a.label"
      class="qaction circular"
      @click="a.action"
    >
      <Switch v-if="a.state" :state="a.state()" />
      <div class="label">{{ a.label }}</div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { triggerScan } from "@/requests/settings/rootdirs";

import Switch from "./Switch.vue";
import useSettings from "@/stores/settings";

const settings = useSettings();

const actions = [
  {
    label: "Rescan library",
    action: triggerScan,
  },
  {
    label: "Sidebar",
    action: settings.toggleDisableSidebar,
    state: () => settings.use_sidebar,
  },
  {
    label: "Crossfade",
    action: settings.toggleCrossfade,
    state: () => settings.use_crossfade,
  },
];
</script>

<style lang="scss">
.settings-quickactions {
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: $medium;

  .qaction {
    background-color: $gray5;
    padding: $medium;
    font-size: 14px;
    border: solid 1px $gray4;

    gap: $smaller;
  }

  .switch {
    transform: scale(0.8);
    margin-left: -$smaller;
  }

  .qaction svg {
    transform: scale(0.75);
  }
  .qaction:nth-child(2) svg {
    transform: rotate(90deg);
  }
}
</style>
