<template>
  <span class="see-all">
    <RouterLink :to="route"> <b>SEE ALL</b> </RouterLink>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  route: string;
}>();
</script>

<style lang="scss">
.see-all {
  font-size: $medium;
  opacity: 0.75;

  a:hover {
    text-decoration: underline;
  }
}
</style>
