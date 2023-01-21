<template>
  <router-link :to="{ name: Routes.folder, params: { path: folder.path } }">
    <div
      class="f-item"
      @click.prevent="handleClick"
      @mouseover="mouse_over = true"
      @mouseleave="mouse_over = false"
      :style="{
        backgroundColor: is_checked ? '#234ece' : '',
      }"
    >
      <div class="check">
        <CheckSvg v-if="!is_checked && mouse_over" />
        <CheckFilledSvg v-if="is_checked" />
      </div>

      <FolderSvg v-if="!folder.is_sym" />
      <SymLinkSvg v-if="folder.is_sym" />
      <div class="info">
        <div class="f-item-text ellip">{{ folder.name }}</div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Routes } from "@/router";

import { Folder } from "@/interfaces";

import FolderSvg from "@/assets/icons/folder.svg";
import SymLinkSvg from "@/assets/icons/symlink.svg";

import CheckFilledSvg from "@/assets/icons/check.filled.svg";
import CheckSvg from "@/assets/icons/square.svg";

const props = defineProps<{
  folder: Folder;
  is_checked?: boolean;
}>();

const emit = defineEmits<{
  (e: "navigate"): void;
  (e: "check"): void;
}>();

// const is_checked = ref(false);
const mouse_over = ref(false);

function handleClick(e: MouseEvent) {
  // check if the click was on the checkbox
  if (e.target instanceof Element && e.target.closest(".check")) {
    emit("check");
    return;
  }

  if (!props.is_checked) {
    emit("navigate");
  }
}
</script>

<style lang="scss">
.f-item {
  height: 5rem;
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  background-color: $gray;
  transition: all 0.2s ease;
  border-radius: 0.75rem;
  position: relative;

  .check {
    z-index: 10;
    position: absolute;
    top: $smaller;
    right: -$smaller;

    border: none;
    outline: none;
    scale: 0.75;
    color: $darkblue;
  }

  @include phone-only {
    height: 4rem;
  }

  svg {
    margin: 0 $small 0 1rem;
  }

  .f-item-text {
    margin-right: 1rem;
  }

  &:hover {
    background: $gray3;
    background-size: 105% 105%;
    background-position-x: -$small;

    .f-item-count {
      color: #ffffff;
    }
  }
}
</style>
