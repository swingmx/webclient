<template>
  <router-link
    v-if="!hide_album"
    class="song-album ellip"
    v-tooltip
    :to="{
      name: 'AlbumView',
      params: {
        hash: albumhash || 'Unknown',
      },
    }"
  >
    {{ album }}
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  hide_album: boolean;
  albumhash: string;
  album: string;
}>();
</script>

<style lang="scss">
.song-album {
  max-width: max-content;
  color: inherit;
  cursor: pointer !important;

  &:hover {
    text-decoration: underline;
  }
}
</style>
