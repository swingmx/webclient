<template>
  <div class="albumlistviewhead">
    <GenericHeader>
      <template #name>{{
        (is_albumlist ? "Album" : "Artist") + (is_not_one ? "s" : "")
      }}</template>
      <template #description>
        You have {{ total.toLocaleString() }}
        {{ (is_albumlist ? "album" : "artist") + (is_not_one ? "s" : "") }} in
        your library</template
      >
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
const is_not_one = computed(() => props.total !== 1);
</script>
