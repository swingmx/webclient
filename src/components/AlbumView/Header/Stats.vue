<template>
  <div class="album-stats ellip2">
    <div class="border rounded-sm pad-sm ellip">
      <ArtistName
        :artists="album.albumartists"
        :albumartists="''"
        :small="true"
        :append="
          !isSmallPhone
            ? `• ${album.date}  •  ${album.count} ${
                album.count === 1 ? 'Track' : 'Tracks'
              }  •  ${formatSeconds(album.duration, true)}`
            : ''
        "
      />
    </div>
    <div class="stats2" v-if="isSmallPhone">
      {{ album.date }} • {{ album.count }} Tracks •
      {{ formatSeconds(album.duration, true) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Album } from "@/interfaces";
import { formatSeconds } from "@/utils";
import { isSmallPhone } from "@/stores/content-width";

import ArtistName from "@/components/shared/ArtistName.vue";

defineProps<{
  album: Album;
}>();
</script>

<style lang="scss">
.album-stats {
  font-weight: bold;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;

  .artistname {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div {
    font-size: 0.8rem;
    word-break: normal;
  }
}
</style>
