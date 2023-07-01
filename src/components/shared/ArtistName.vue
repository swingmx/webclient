<template>
  <span
    style="width: fit-content"
    class="artistname ellip"
    :style="{
      width: 'fit-content',
      fontSize: small ? '0.85rem' : smaller ? 'small' : '',
    }"
    @click.stop="() => {}"
  >
    <div v-tooltip v-if="artists === null || artists.length === 0">
      <span>{{ albumartists }}</span>
    </div>
    <div v-tooltip v-else>
      <template
        v-for="(artist, index) in artists.slice(0, 3)"
        :key="artist.artisthash"
      >
        <RouterLink
          class="artist"
          :to="{
            name: Routes.artist,
            params: { hash: artist.artisthash },
          }"
          >{{ `${artist.name}` }}</RouterLink
        >
        <span v-if="index < artists.length - 1">, </span>
        <span v-if="artists.length > 3 && index === 2">
          +{{ artists.length - 3 }} more
        </span>
      </template>
      &nbsp; {{ append ? append : "" }}
    </div>
  </span>
</template>

<script setup lang="ts">
import { Artist } from "@/interfaces";
import { Routes } from "@/router";
import artist from "@/stores/pages/artist";

defineProps<{
  artists: Artist[] | null;
  albumartists: Artist[] | string | null;
  append?: string;
  small?: boolean;
  smaller?: boolean;
}>();
</script>

<style lang="scss">
.artistname {
  a {
    color: inherit;
    cursor: pointer !important;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
