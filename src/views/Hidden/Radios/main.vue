<template>
  <div v-if="settings.hidden_radios_unlocked" class="swing-radios">
    <Header>
      <template #name> Internet Radios </template>
      <template #description>
        Listen to your favorite internet radio stations from around the world.
      </template>
    </Header>
    <RadioGroup :radios="radios" :heading="'Recently Played'" />
    <RadioGroup :radios="radios" :heading="'Talk Show'" />
    <RadioGroup :radios="radios" :heading="'Top Pop'" />
  </div>
  <NotFound v-else />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import useSettingsStore from "@/stores/settings";

import Header from "@/components/Radios/GenericHeader.vue";
import RadioGroup from "@/components/Radios/RadioGroup.vue";
import NotFound from "@/views/NotFound.vue";
import { radios } from "./radios";

const settings = useSettingsStore();

onMounted(() => {
  settings.unlockHiddenRadios();
});
</script>

<style lang="scss">
.swing-radios {
  margin-left: 1.25rem;
  margin-right: -1rem;
  padding-right: 1.25rem;
  max-height: 100%;
  overflow-y: scroll;
}
</style>
