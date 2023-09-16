<template>
  <div v-if="!isSmallPhone" v-auto-animate class="albumtype">
    <span v-if="album.is_soundtrack">Soundtrack</span>
    <span v-else-if="album.is_live">Concert</span>
    <span v-else-if="album.is_compilation">Compilation</span>
    <span v-else-if="album.is_EP">EP</span>
    <span v-else-if="album.is_single">Single</span>
    <span v-else>Album</span>
  </div>
</template>

<script setup lang="ts">
import { Album } from "@/interfaces";
import { isSmallPhone } from "@/stores/content-width";

defineProps<{
  album: Album;
}>();
</script>

<style lang="scss"></style>
