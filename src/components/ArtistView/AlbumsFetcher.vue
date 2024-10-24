<template>
  <div style="height: 1px">
    <button v-if="show_text" @click="fetch_callback">Load More</button>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import { updateCardWidth } from "@/stores/content-width";

const props = defineProps<{
  show_text?: boolean;
  fetch_callback: () => Promise<void>;
  reset_callback?: () => Promise<void>;
  outside_route?: boolean;
}>();

const update = async () => {
  await nextTick();

  updateCardWidth();
};

onMounted(async () => {
  props.fetch_callback().then(update);
});

!props.outside_route &&
  onBeforeRouteUpdate(() => {
    if (!props.reset_callback) return;
    props.reset_callback().then(update);
  });
</script>
