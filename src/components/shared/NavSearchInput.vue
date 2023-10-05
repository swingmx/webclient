<template>
  <div class="header-input-wrapper rounded-sm" :class="{ showInput: clicked }">
    <button
      id="page-search-trigger"
      v-wave
      class="search-btn"
      :class="{ 'btn-active': clicked }"
      @click="handleFocus"
    >
      <SearchSvg />
    </button>
    <input
      id="page-search"
      ref="inputRef"
      v-model.trim="query"
      class="header-input pad-sm rounded-sm"
      :class="{ showInput: clicked }"
      :placeholder="currentEmoji"
      type="search"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import useAlbumStore from "@/stores/pages/album";
import useFolderStore from "@/stores/pages/folder";
import usePStore from "@/stores/pages/playlist";

import SearchSvg from "@/assets/icons/search.svg";
import { Routes } from "@/router";

const clicked = ref(false);
const [playlist, album, folder] = [
  usePStore(),
  useAlbumStore(),
  useFolderStore(),
];

const { query: playlistQuery } = storeToRefs(playlist);
const { query: folderQuery } = storeToRefs(folder);
const { query: albumQuery } = storeToRefs(album);

const props = defineProps<{
  page: typeof Routes | string;
}>();
const inputRef = ref<HTMLElement>();

function handleFocus() {
  clicked.value = !clicked.value;
  if (clicked.value) {
    inputRef.value?.focus();
    setRandomEmoji();
  } else {
    inputRef.value?.blur();
    resetQuery();
  }
}

function getRef() {
  switch (props.page) {
    case Routes.playlist:
      return [playlistQuery, playlist.resetQuery];

    case Routes.folder:
      return [folderQuery, folder.resetQuery];

    case Routes.album:
      return [albumQuery, album.resetQuery];

    default:
      return null;
  }
}

const source = getRef();
let query: any;
let resetQuery: any;

if (source) {
  query = source[0];
  resetQuery = source[1];
}

const currentEmoji = ref("");

function setRandomEmoji() {
  const emojis = ["😹", "😺", "😻", "😸", "😼", "😽", "🙀", "😿", "😾"];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  currentEmoji.value = emojis[randomIndex];
}

onMounted(() => setRandomEmoji());
</script>

<style lang="scss">
.header-input-wrapper {
  &.showInput {
    width: 19rem;
  }

  display: flex;
  flex-direction: row-reverse;
  width: 5rem;
  gap: $small;
  transition: all 0.25s;
  transition-delay: 0.1s;
}

.header-input {
  background-color: transparent;
  border: none;
  color: white;
  z-index: 200;
  font-size: 1rem;
  transition: all 0.25s $overshoot;
  opacity: 0;
  transform: translateY(-3.5rem);
  padding-left: 1rem !important;
  outline: none;
  background-color: $gray3;

  &:focus {
    background-color: $darkestblue;
  }

  &.showInput {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.1s;
  }
}

.search-btn {
  cursor: pointer;
  padding: 0 $small;
  // padding-right: 1rem;
}
</style>
