<template>
  <div class="smdropdown buttons" :class="component_key">
    <div v-auto-animate="{ duration: 10 }" class="select rounded-sm">
      <button class="selected" @click.prevent="showDropDown = !showDropDown">
        <DropDownTrack
          v-if="component_key == 'lyricsplugin'"
          :item="current"
          :hide-img="true"
        />
        <span v-else class="ellip">{{ current }}</span>
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
          @click.prevent="handleClick(a)"
        >
          <DropDownTrack v-if="component_key == 'lyricsplugin'" :item="a" />
          <span v-else>
            {{ a }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

import ArrowSvg from "@/assets/icons/expand.svg";
import DropDownTrack from "@/components/Plugins/Lyrics/DropDownTrack.vue";

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
      border-bottom: 1px solid $gray4;
      width: 7.5rem;

      &:hover {
        border-radius: $smaller;
        border-bottom: 1px solid transparent;
        background-color: $darkestblue;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
.lyricsplugin {
  .select {
    width: 14rem;
  }

  .option {
    width: 13.5rem !important;
  }
}
</style>
