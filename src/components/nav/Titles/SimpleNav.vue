<template>
  <h2 class="simple-nav-title" style="margin: 0">{{ text }}</h2>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<style lang="scss">
.simple-nav-title {
  @include mediumPhones {
    font-size: 1.3rem;
  }
}
</style>
