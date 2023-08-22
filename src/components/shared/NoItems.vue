<template>
  <div v-if="flag" class="nothing rounded">
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

  h3 {
    margin-top: 2.75rem;
  }

  svg {
    transform: scale(5);
  }

  & > * {
    margin: auto;
    text-align: center;
  }
}
</style>
