<template>
  <div class="album-stats ellip2">
    <div class="ellip">
      <ArtistName
        :artists="album.albumartists"
        :albumartists="''"
        :small="true"
        :append="!isSmallPhone ? statsText : ''"
        :prepend="isSmallPhone ? $t('AlbumView.AlbumBy') : ''"
      />
    </div>
    <div v-if="isSmallPhone" class="stats2">
      {{ new Date(album.date * 1000).getFullYear() }} {{ !album.is_single ? `• ${album.trackcount} ${$t('AlbumView.TrackCountPlural')}` : "" }} •
      {{ formatSeconds(album.duration, true) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { Album } from "@/interfaces";
import { isSmallPhone } from "@/stores/content-width";
import { formatSeconds } from "@/utils";

import ArtistName from "@/components/shared/ArtistName.vue";

const { t } = useI18n();

const props = defineProps<{
  album: Album;
}>();

const statsText = computed(() => {
  const is_single = props.album.is_single;

  // hide track count if it's a single, also add an s to track if it's plural
  return `• ${new Date(props.album.date * 1000).getFullYear()} ${
    !is_single ? `• ${props.album.trackcount.toLocaleString()} ${props.album.trackcount > 1 ? $t('AlbumView.TrackCountPlural') : $t('AlbumView.TrackCount')}` : ""
  } • ${formatSeconds(props.album.duration, true)}`;
});
</script>

<style lang="scss">
.album-stats {
  font-weight: 700;
  margin-bottom: 0.75rem;
  font-size: 14px;
  padding-left: $smaller;

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
