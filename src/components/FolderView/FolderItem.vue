<template>
  <router-link :to="{ name: Routes.folder, params: { path: folder.path } }">
    <div
      class="f-item"
      @click="(e) => (folder_page ? null : handleClick(e))"
      @mouseover="mouse_over = true"
      @mouseleave="mouse_over = false"
      :style="{
        backgroundColor: is_checked ? '#234ece' : '',
      }"
      v-auto-animate
    >
      <div class="check" v-if="!folder_page">
        <CheckSvg v-if="!is_checked && mouse_over" />
        <CheckFilledSvg v-if="is_checked" />
      </div>

      <FolderSvg v-if="!folder.is_sym" />
      <SymLinkSvg v-if="folder.is_sym" />
      <div class="info">
        <div class="f-item-text ellip">{{ folder.name }}</div>
        <div class="f-count" v-if="folder.count">
          {{ folder.count + ` File${folder.count == 1 ? "" : "s"}` }}
        </div>
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
  folder_page?: boolean;
}>();

const emit = defineEmits<{
  (e: "navigate"): void;
  (e: "check"): void;
}>();

const mouse_over = ref(false);

function handleClick(e: MouseEvent) {
  e.preventDefault();
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
  border-radius: $medium;
  position: relative;

  .f-count {
    font-size: $medium;
    font-weight: 700;
    color: $gray1;
    margin-top: $smaller;
  }

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
    color: $gray1;
  }

  .f-item-text {
    margin-right: 1rem;
  }

  &:hover {
    background: $gray3;
  }
}
</style>
