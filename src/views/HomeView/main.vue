<template>
  <div class="homepageview content-page">
    <GenericHeader>
      <template #name>Home</template>
      <template #description>{{ getGreetings("") }}</template>
      <template #right?> </template>
    </GenericHeader>
    <Browse />
    <RecentItems
      v-if="home.recentlyAdded.length"
      :title="'Recently Added'"
      :items="home.recentlyAdded"
      :play-source="playSources.recentlyAdded"
      :route="'/playlist/recentlyadded'"
    />
    <RecentItems
      v-if="home.recentlyPlayed.length"
      :title="'Recently Played'"
      :items="home.recentlyPlayed"
      :play-source="playSources.track"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";

import useHome from "@/stores/home";
import { playSources } from "@/enums";
import updatePageTitle from "@/utils/updatePageTitle";
import { updateCardWidth } from "@/stores/content-width";

import Browse from "@/components/HomeView/Browse.vue";
import RecentItems from "@/components/shared/CardScroller.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";
import { onBeforeRouteLeave } from "vue-router";

const home = useHome();

function getGreetings(username: string) {
  const date = new Date();
  const hour = date.getHours();

  if (hour <= 3) {
    return "Hey there night owl";
  } else if (hour <= 5) {
    return "Hey there early bird";
  } else if (hour <= 12) {
    return "Good morning " + username;
  } else if (hour <= 18) {
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

onBeforeRouteLeave(() => home.resetAll());
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
