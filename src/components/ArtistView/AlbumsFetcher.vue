<template>
  <div style="height: 1px"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import { updateCardWidth } from "@/stores/content-width";

const props = defineProps<{
  fetch_callback: () => Promise<void>;
  reset_callback: () => Promise<void>;
}>();

const update = async () => {
  await nextTick();

  updateCardWidth();
};

onMounted(async () => {
  props.fetch_callback().then(update);
});

onBeforeRouteUpdate(() => {
  props.reset_callback().then(update);
});
</script>
