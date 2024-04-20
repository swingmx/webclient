<template>
  <div
    ref="parentRef"
    class="context-item"
    @mouseenter="option.children && !isSmall && childrenShowMode === contextChildrenShowMode.hover && showChildren()"
    @mouseleave="option.children && !isSmall && childrenShowMode === contextChildrenShowMode.hover && hideChildren()"
    @click="runAction"
  >
    <div class="icon image" v-html="option.icon"></div>
    <div class="label ellip">{{ option.label }}</div>
    <div v-if="option.children" class="more" v-html="ExpandIcon"></div>
    <div v-if="option.children" ref="childRef" class="children rounded shadow-sm">
      <div className="wrapper">
        <div
          v-for="child in option.children"
          :key="child.label"
          class="context-item"
          :class="[{ critical: child.critical }, child.type]"
          @click="child.action && runChildAction(child.action)"
        >
          <div class="label ellip">
            {{ child.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createPopper, Instance } from "@popperjs/core";
import { ref } from "vue";

import { contextChildrenShowMode } from "@/enums";
import { ExpandIcon } from "@/icons";
import { Option } from "@/interfaces";
import { isSmall } from "@/stores/content-width";

const props = defineProps<{
  option: Option;
  childrenShowMode: contextChildrenShowMode;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: "hideContextMenu"): void;
}>();

const parentRef = ref<HTMLElement>();
const childRef = ref<HTMLElement>();
const childrenShown = ref(false);

let popperInstance: Instance | null = null;

function showChildren() {
  if (childrenShown.value) {
    childrenShown.value = false;
    return;
  }

  popperInstance = createPopper(parentRef.value as HTMLElement, childRef.value as HTMLElement, {
    placement: "right-start",
    modifiers: [
      {
        name: "flip",
        options: {
          fallbackPlacements: ["left-start", "auto"],
        },
      },
    ],
  });
  childRef.value ? (childRef.value.style.visibility = "visible") : null;
  childRef.value ? (childRef.value.style.opacity = "1") : null;
  childrenShown.value = true;
}

function hideChildren() {
  childRef.value ? (childRef.value.style.visibility = "hidden") : null;
  childRef.value ? (childRef.value.style.opacity = "0") : null;
  popperInstance?.destroy();
  childrenShown.value = false;
}

function hideContextMenu() {
  if (props.option.children) return;
  emit("hideContextMenu");
}

function runAction() {
  if (props.option.children) {
    if (childrenShown.value) {
      hideChildren();
      return;
    }

    showChildren();
    return;
  }

  props.option.action && props.option.action();
  hideContextMenu();
}

function runChildAction(action: () => void) {
  action();
  emit("hideContextMenu");
}
</script>

<style lang="scss">
.context-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.4rem;
  position: relative;
  border-radius: $small;
  transition: background-color 0.2s ease-out;

  .more {
    height: 1.5rem;
    width: 1.5rem;
    position: absolute;
    right: 2px;
    bottom: 5px;
    transform: scale(0.65);
  }

  .children {
    position: absolute;
    width: 12rem;
    z-index: 10;
    transform: scale(0);
    background-color: $context;
    padding: $smaller;
    border: solid 1px $gray3;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.25s ease-out, visibility 0.25s ease-out;

    .wrapper {
      padding: $smaller;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(100vh / 2);
    }

    .context-item {
      padding: $small 1rem;
      padding: 0.4rem 0.6rem;
    }

    .separator {
      padding: 0;
    }
  }

  &:hover {
    background: $darkestblue;
  }

  .icon {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: $small;

    svg {
      height: 100%;
      width: 100%;
      transform: scale(1.15);
    }
  }

  // add to queue icon
  &:nth-child(3) .icon > svg {
    transform: scale(0.9);
  }

  .label {
    width: 9rem;
  }
}
</style>
