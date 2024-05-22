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
    <div v-if="artists === null || artists.length === 0" v-tooltip>
      <span class="artist">{{ albumartists }}</span>
    </div>
    <div v-else v-tooltip>
      <span>{{ prepend ? prepend : "" }}</span>
      <template v-for="(artist, index) in artists" :key="index">
        <RouterLink
          class="artist"
          :to="{
            name: Routes.artist,
            params: { hash: artist.artisthash },
          }"
          >{{ `${artist.name}` }}</RouterLink
        >
        <span v-if="index < artists.length - 1" class="artist"
          >,
        </span> </template
      >&nbsp;
      <span>{{ append ? append : "" }}</span>
    </div>
  </span>
</template>

<script setup lang="ts">
import { Artist } from "@/interfaces";
import { Routes } from "@/router";

defineProps<{
  artists: Artist[] | null;
  albumartists: Artist[] | string | null;
  append?: string;
  prepend?: string;
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
