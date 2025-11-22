<template>
  <div class="albumlistviewhead">
    <GenericHeader>
      <template #name>{{ $t('Common.Album', props.total)
      }}</template>
      <template #description>
        {{ $t('Views.Header.TotalAlbumAndArtists',
          {
            tot: total.toLocaleString(), 
            what: is_albumlist ? $t('Common.Album', props.total) : $t('Common.Artist', props.total)
          })
        }}
        </template>
    </GenericHeader>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import GenericHeader from "@/components/shared/GenericHeader.vue";
import { Routes } from "@/router";

const props = defineProps<{
  total: number;
}>();

const route = useRoute();

const is_albumlist = computed(() => route.name == Routes.AlbumList);
</script>
