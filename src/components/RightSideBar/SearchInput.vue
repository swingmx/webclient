<template>
  <div
    class="gsearch-input"
    @click="
      !settings.use_sidebar &&
        $route.name !== Routes.search &&
        $router.push({
          name: Routes.search,
          params: { page: 'top' },
          query: { q: search.query },
        })
    "
  >
    <div id="ginner" ref="inputRef" tabindex="0">
      <button
        v-auto-animate
        :title="tabs.current === tabs.tabs.search ? 'back to queue' : 'go to search'"
        :class="{ no_bg: on_nav }"
        @click.prevent="handleButton"
      >
        <SearchSvg v-if="on_nav || tabs.current === tabs.tabs.queue" />
        <BackSvg v-else />
      </button>
      <input
        id="globalsearch"
        v-model.trim="search.query"
        placeholder="Start typing to search"
        type="search"
        autocomplete="off"
        spellcheck="false"
        @blur.prevent="removeFocusedClass"
        @focus.prevent="addFocusedClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import useSearch from "@/stores/search";
import useSettings from "@/stores/settings";
import useTabStore from "@/stores/tabs";

import BackSvg from "@/assets/icons/arrow.svg";
import SearchSvg from "@/assets/icons/search.svg";
import { Routes } from "@/router";

const props = defineProps<{
  on_nav?: boolean;
}>();

const tabs = useTabStore();
const search = useSearch();
const settings = useSettings();

// HANDLE FOCUS
const inputRef = ref<HTMLElement>();

// NOTE: Functions are used because classes are added to the sorrounding element
// and not the input itself.
function addFocusedClass() {
  inputRef.value?.classList.add("search-focused");
}

function removeFocusedClass() {
  inputRef.value?.classList.remove("search-focused");
}

// @end

function handleButton() {
  if (props.on_nav) return;

  if (tabs.current === tabs.tabs.search) {
    tabs.switchToQueue();
  } else {
    tabs.switchToSearch();
  }
}
</script>

<style lang="scss">
.gsearch-input {
  display: grid;
  grid-template-columns: 1fr max-content;

  #ginner {
    width: 100%;
    display: flex;
    align-items: center;
    // gap: $small;
    border-radius: 3rem;
    background-color: $gray5;
    outline: solid 2px transparent;
    transition: outline-color 0.2s ease-out;

    button {
      background: transparent;
      border: none;
      width: 3rem;
      padding: 0;
      border-radius: 3rem;
      height: 100%;
      cursor: pointer;

      &:hover {
        transition: all 0.2s ease;
        background-color: $gray2;
      }
    }

    button.no_bg {
      pointer-events: none;
    }

    input {
      width: 100%;
      border: none;
      line-height: 2.25rem;
      color: inherit;
      font-size: 14px;
      font-weight: 500;
      background-color: transparent;
      outline: none;
      appearance: none;
      padding-right: 1rem;

      @media screen and (max-width: 500px) {
        width: 7rem;
      }
    }
  }
}

.search-focused {
  outline: solid 2px #fff !important;
}
</style>
