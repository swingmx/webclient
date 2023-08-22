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

import { Radio } from "@/interfaces";
import useSettingsStore from "@/stores/settings";

import NotFound from "@/views/NotFound.vue";
import Header from "@/components/Radios/Header.vue";
import RadioGroup from "@/components/Radios/RadioGroup.vue";

const settings = useSettingsStore();

const radios = <Radio[]>[
  {
    name: "Majestic Jukebox Radio",
    image:
      "https://cdn.stockmediaserver.com/smsimg28/pv/IsignstockContributors/iss_12137_02431.jpg?token=9EyvJEX77Q5SGjcieui_RKvjl0lxBBnfFuCp0Z-r3gA&class=pv&smss=53&expires=4102358400",
    genres: ["Oldies", "Classics"],
  },
  {
    name: "Dash Radio - Dash Pop X",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/ccc7d49efe8bdc430758b65af26d3485/264x264-000000-80-0-0.jpg",
    src: "http://ice55.securenetsystems.net/DASH17",
    genres: ["Pop"],
  },
  {
    name: "Dash Radio - Pop Family",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/5d2ea9aff86c5db72c46bac0f6b80f03/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
  {
    name: "United Music - Movies Pop",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/7501739459b137208ae3bc269b9b08d0/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
  {
    name: "NRJ POP",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/0c2c32f78cc9589f99801e8563a104e1/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
  {
    name: "pop101 - laut.fm",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/cdb55a5517f48ae5bff37a6f1bcfb4ee/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
  {
    name: "0N - Pop on Radio",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/0c1c22f3d0a8b0bfce315ccefdfb6b56/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
  {
    name: "Traxx FM - Pop",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/a49c8a6b62bb959bf6125465d798fddc/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
  {
    name: "Dash Radio - Dash Hits X",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/e0ff3327de59f0537761a149bedd0dbd/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
  {
    name: "Cola-Pop - laut.fm",
    image:
      "https://e-cdns-images.dzcdn.net/images/misc/981a75b7c813593f698062230287b116/264x264-000000-80-0-0.jpg",
    genres: ["Pop"],
  },
];

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
