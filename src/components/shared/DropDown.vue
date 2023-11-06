<template>
  <div class="smdropdown buttons" :class="component_key">
    <div v-auto-animate="{ duration: 10 }" class="select rounded-sm">
      <button class="selected" @click.prevent="handleOpener">
        <span class="ellip">{{ current }}</span>
        <ArrowSvg />
      </button>
      <div
        v-if="showDropDown"
        ref="dropOptionsRef"
        class="options rounded-sm shadow-lg"
      >
        <div
          v-for="a in items"
          :key="a"
          class="option"
          :class="{ current: current == a }"
          @click.prevent="handleClick(a)"
        >
          {{ a }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

import ArrowSvg from "@/assets/icons/expand.svg";

const showDropDown = ref(false);
const dropOptionsRef: Ref<HTMLElement | undefined> = ref();

defineProps<{
  items: any[];
  current: any;
  component_key: string;
}>();

const emit = defineEmits<{
  (event: "itemClicked", item: any): void;
}>();

const handleOpener = () => {
  showDropDown.value = !showDropDown.value;
};

const handleClick = (item: any) => {
  emit("itemClicked", item);
  showDropDown.value = false;
};

onClickOutside(dropOptionsRef, (e) => {
  // @ts-ignore
  e.stopImmediatePropagation();
  showDropDown.value = false;
});
</script>

<style lang="scss">
.smdropdown {
  .selected {
    display: grid;
    grid-template-columns: 1fr 2rem;
    gap: $smaller;
    width: 100%;
    padding-right: 0;

    svg {
      transform: rotate(90deg) scale(0.9);
    }
  }

  .select {
    position: relative;
    width: 8rem;
    display: flex;
    align-items: center;
    font-size: calc($medium + 2px);
    z-index: 10;

    .options {
      background-color: $gray;
      position: absolute;
      top: 120%;
      padding: $small $smaller;
      display: grid;
    }

    .option {
      padding: $small;
      width: 7.5rem;
      border-radius: $smaller;
      margin: 0 $smaller;

      &:hover {
        background-color: $darkestblue;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .current {
      background-color: $gray5;
    }
  }
}
</style>
