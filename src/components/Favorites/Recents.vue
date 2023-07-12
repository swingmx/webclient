<template>
  <div class="card-list-scroll-x">
    <h3>Recent</h3>
    <div ref="recentitemswrappers" class="cards">
      <Recentsitemcard
        v-for="fav in favs.slice(0, maxAbumCards)"
        :key="JSON.stringify(fav)"
        :fav="fav"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Recentsitemcard from "@/components/Favorites/RecentsItemCard.vue";
import { RecentFavResult } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";

defineProps<{
  favs: RecentFavResult[];
}>();

const recentitemswrappers = ref<HTMLElement | null>(null);
</script>
