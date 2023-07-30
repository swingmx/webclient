<template>
  <div class="nothing rounded" v-if="flag">
    <div>
      <component :is="icon" />
      <h3>{{ title }}</h3>
      <p>
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: any;
  flag: boolean;
  title: string;
  description: string;
}>();
</script>

<style lang="scss">
.nothing {
  height: 100%;
  max-width: 25rem;
  margin: 0 auto;
  display: grid;
  opacity: 0.5;

  p {
    word-break: break-word;
  }

  svg {
    margin-bottom: 2rem;
    transform: scale(5);
  }

  & > * {
    margin: auto;
    text-align: center;
  }
}
</style>
