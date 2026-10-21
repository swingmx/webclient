<template>
  <div
    class="index t-center ellip"
    @click.prevent="$emit('addToFav')"
    @dblclick.prevent.stop="() => {}"
    :class="{ 'ready': !showInlineFavIcon }"
  >
    <div class="text">
      {{ index }}
    </div>
    <div class="heart-icon" v-if="!showInlineFavIcon">
      <HeartSvg :state="is_fav" :no_emit="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeartSvg from "../HeartSvg.vue";

defineProps<{
  index: number | string;
  is_fav: boolean | undefined;
  showInlineFavIcon: boolean;
}>();

defineEmits<{
  (e: "addToFav"): void;
}>();
</script>
