<template>
  <div class="homepageview content-page">
    <GenericHeader>
      <template #name>Home</template>
      <template #description>{{ getGreetings("cwilvx") }}</template>
      <template #right?> </template>
    </GenericHeader>
    <RecentItems
      :title="'Recently Added'"
      :items="home.recentlyAdded"
      :play-source="playSources.recentlyAdded"
      :route="'/playlist/recentlyadded'"
    />
    <RecentItems
      :title="'Recently Played'"
      :items="home.recentlyPlayed"
      :play-source="playSources.recentlyPlayed"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";

import { playSources } from "@/enums";
import { updateCardWidth } from "@/stores/content-width";
import useHome from "@/stores/home";

import RecentItems from "@/components/shared/CardScroller.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";
import updatePageTitle from "@/utils/updatePageTitle";

const home = useHome();

function getGreetings(username: string) {
  const date = new Date();
  const hour = date.getHours();

  if (hour < 3) {
    return "Hey there night owl";
  } else if (hour < 5) {
    return "Hey there early bird";
  } else if (hour < 11) {
    return "Good morning " + username;
  } else if (hour < 16) {
    return "Good afternoon " + username;
  } else {
    return "Goooood evening " + username;
  }
}

onMounted(async () => {
  updatePageTitle("Home");
  await home.fetchRecentlyAdded();

  nextTick().then(updateCardWidth);

  await home.fetchRecentlyPlayed();
});
</script>

<style lang="scss">
.homepageview {
  height: 100%;
  overflow: auto;

  .generichead {
    margin-bottom: 0;
  }
}
</style>
