<template>
  <div class="recent-items">
    <h3>Recently added</h3>
    <div class="list">
      <Recentsitemcard
        v-for="fav in favs.slice(0, maxAbumCards)"
        :key="JSON.stringify(fav)"
        :fav="fav"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecentFavResult } from "@/interfaces";
import Recentsitemcard from "@/components/Favorites/RecentsItemCard.vue";
import { maxAbumCards } from "@/stores/content-width";

defineProps<{
  favs: RecentFavResult[];
}>();
</script>

<style lang="scss">
.recent-items {
  max-height: 20rem;
  overflow: hidden;

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 5rem 0;
  }
}
</style>
