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
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";

import useHome from "@/stores/home";
import { album_card_with } from "@/stores/content-width";

import RecentItems from "@/components/HomeView/RecentItems.vue";
import GenericHeader from "@/components/shared/GenericHeader.vue";

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
  document.title = "Home | Swing Music";
  await home.fetchRecentlyAdded();

  nextTick().then(() => {
    const elems = document.getElementsByClassName("hlistitem");

    if (elems.length) {
      album_card_with.value = elems[0].clientWidth;
    }
  });
});
</script>

<style lang="scss">
.homepageview {
  height: 100%;
  overflow: auto;

  .generichead {
    padding: 0 $small;
  }

  padding-bottom: 4rem;
}
</style>
