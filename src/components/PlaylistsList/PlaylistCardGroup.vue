<template>
  <div class="playlistcardgroup">
    <h3>{{ title }}</h3>
    <div class="grid">
      <PlaylistCard v-for="p in playlists" :key="p.id" :playlist="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlaylistCard from "@/components/PlaylistsList/PlaylistCard.vue";
import { Playlist } from "@/interfaces";

defineProps<{
  playlists: Playlist[];
  title: string;
}>();
</script>

<style lang="scss">
.playlistcardgroup {
  margin-bottom: 4rem;
  h3 {
    margin-left: $medium;
  }
}
</style>
