<template>
  <div v-if="settings.hidden_radios_unlocked" class="swing-radios">
    <Header>
      <template #name> Internet Radios </template>
      <template #description>
        <span></span>
      </template>
    </Header>
    <RadioGroup
      :radios="radios.filter((r) => r.genres.includes('Pop'))"
      :heading="'Pop Radios'"
      :tagline="'Listen to the pop hits of yesterday, today and tommorow'"
    />
    <RadioGroup
      :radios="radios.filter((r) => r.genres.includes('Country'))"
      :heading="'Country Radios'"
      :tagline="'Bring out the cowboy in you'"
    />
    <RadioGroup
      :radios="radios.filter((r) => r.genres.includes('Pop'))"
      :heading="'Grand Theft Auto V'"
      :tagline="`Relive the moments ... Cops, 5 Stars, and a stolen automobile.`"
    />
    <RadioGroup
      :radios="radios.filter((r) => r.genres.includes('Classics'))"
      :heading="'Classic Radios'"
      :tagline="'Take a trip back ... to the future of music'"
    />
  </div>
  <NotFound v-else />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { radios } from "./radios";
import useSettingsStore from "@/stores/settings";

import NotFound from "@/views/NotFound.vue";
import Header from "@/components/Radios/GenericHeader.vue";
import RadioGroup from "@/components/Radios/RadioGroup.vue";


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
