<template>
  <div style="height: 1px"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

const props = defineProps<{
  fetch_callback: () => void;
  reset_callback: () => void;
}>();

onMounted(async () => {
  props.fetch_callback();
});

onBeforeRouteUpdate(() => {
  props.reset_callback();
});
</script>
