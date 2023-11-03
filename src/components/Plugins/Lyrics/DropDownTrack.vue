<template>
  <div
    class="lyricsplugintrack"
    :title="`Title:\t&nbsp;&nbsp;&nbsp;${item.title} \nArtist:\t&nbsp;&nbsp;&nbsp;${item.artist}\nAlbum:&nbsp;&nbsp;&nbsp;&nbsp;${item.album}`"
    :class="{ hideImg }"
  >
    <img v-if="!hideImg" :src="item.image" />
    <span v-if="hideImg" class="ellip">{{ item.album }}</span>
    <div v-else>
      <div class="title ellip">{{ item.album }}</div>
      <div class="artist ellip">{{ item.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: any;
  hideImg?: boolean;
}>();
</script>

<style lang="scss">
.lyricsplugintrack {
  display: grid;
  grid-template-columns: 3rem 1fr;
  align-items: flex-end;

  &.hideImg {
    display: block;
  }
}
</style>
