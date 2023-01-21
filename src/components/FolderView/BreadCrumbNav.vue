<template>
  <div class="breadcrumb-nav">
    <div
      class="path"
      v-for="path in subPaths.slice(1)"
      :key="path.path"
      :class="{ inthisfolder: path.active }"
      @click.prevent="emit('navigate', path.path)"
    >
      <a class="text">{{ path.name }}</a>
      <!-- 👆 the a tag was misused to avoid rewriting css after moving this code to a component -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { subPath } from "@/interfaces";

defineProps<{
  subPaths: subPath[];
}>();

const emit = defineEmits<{
  (e: "navigate", path: string): void;
}>();
</script>

<style lang="scss">
.breadcrumb-nav {
  display: flex;
  gap: $smaller;

  &::-webkit-scrollbar {
    display: none;
  }

  .path {
    white-space: nowrap;
    margin: auto 0;

    .text {
      padding: $smaller;
      border-radius: $smaller;
    }

    &::before {
      content: "∕";
      margin-right: $smaller;
      color: $gray2;
      font-size: 1rem;
    }

    &:first-child {
      display: none;
    }

    &:last-child {
      padding-right: $smaller;
    }

    &:hover {
      .text {
        background-color: $gray;
      }
    }
  }

  .inthisfolder > .text {
    background-color: $gray;
    transition: all 0.5s;
  }
}
</style>
