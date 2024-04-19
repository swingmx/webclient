<template>
  <div class="breadcrumb-nav">
    <div
      v-for="path in subPaths"
      :key="path.path"
      class="path"
      :class="{ inthisfolder: path.active }"
      @click.prevent="$emit('navigate', path.path)"
    >
      <a class="text">{{ path.name }}</a>
      <!-- 👆 the a tag was misused to avoid rewriting css after moving this code to a component -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUpdated } from "vue";

import { subPath } from "@/interfaces";
import { focusElemByClass } from "@/utils";

import useSettings from "@/stores/settings";

const settings = useSettings();

defineProps<{
  subPaths: subPath[];
}>();

defineEmits<{
  (e: "navigate", path: string): void;
}>();

onUpdated(() => {
  if (settings.is_default_layout) {
    focusElemByClass("inthisfolder");
  }
});
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
    cursor: pointer;
    display: flex;
    align-items: center;

    .text {
      padding: $smaller $small;
      border-radius: $smaller;
      transition: background-color 0.2s ease-out;
    }

    &::before {
      content: "∕";
      margin-right: $smaller;
      color: $gray2;
      font-size: 1rem;
    }

    // &:first-child {
    //   display: none;
    // }

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
