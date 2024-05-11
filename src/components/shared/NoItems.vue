<template>
  <div v-if="flag" class="nothing rounded">
    <div>
      <component :is="icon" />
      <div class="nothingtitle">
        <b>{{ title }}</b>
      </div>
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

  .nothingtitle {
    // margin-top: 2.75rem;
    font-size: 1.15rem;
  }

  svg {
    height: 9rem;
  }

  & > * {
    margin: auto;
    text-align: center;
  }
}
</style>
