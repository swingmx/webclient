<template>
  <br /><br />
  <div style="position: relative">
    <div id="bread-nav" class="bread-nav rounded-sm">
      &nbsp;&nbsp;<span @click="fetchDirs('$root')">$root</span>&nbsp;&nbsp;<BreadCrumbNav
        :sub-paths="subPaths"
        @navigate="fetchDirs"
      />
    </div>
    <div class="set-root-dirs-browser">
      <h4 v-if="no_more_dirs">
        <span class="folder_icon">📂</span> No folders here. Click the "Add this folder" button below to select this
        location.
      </h4>
      <div class="scrollable">
        <div class="content">
          <FolderItem
            v-for="dir in dirs"
            :key="dir.name"
            :folder="dir"
            :is_checked="selected.filter((p) => p == dir.path).length > 0 ? true : false"
            @navigate="fetchDirs(dir.path)"
            @check="handleCheck(dir.path)"
          />
        </div>
      </div>
      <div class="buttons">
        <button class="btn-active select-here" @click="selectHere">Add this folder</button>
        <button class="btn-active finish" @click="submitFolders">Add all checked ({{ getNewDirs().length }})</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";

import { addRootDirs, getFolders, getRootDirs } from "@/requests/settings/rootdirs";

import { Folder, subPath } from "@/interfaces";
import useSettingsStore from "@/stores/settings";
import { createSubPaths } from "@/utils";

import BreadCrumbNav from "../FolderView/BreadCrumbNav.vue";
import FolderItem from "../FolderView/FolderItem.vue";

const settings = useSettingsStore();

const dirs: Ref<Folder[]> = ref([]);
const no_more_dirs = ref(false);
const selected = ref<string[]>([]);

const subPaths = ref<subPath[]>([]);

const prev_selected: string[] = [];

let oldpath = "";
let current = "";

const emit = defineEmits<{
  (e: "hideModal"): void;
}>();

function fetchDirs(path: string) {
  getFolders(path)
    .then((folders) => {
      dirs.value = folders;
      no_more_dirs.value = folders.length == 0;

      [oldpath, subPaths.value] = createSubPaths(path, oldpath);
    })
    .then(() => (current = path == "$home" ? "" : path));
}

function handleCheck(path: string) {
  if (selected.value.includes(path)) {
    selected.value = selected.value.filter((p) => p != path);
  } else {
    selected.value.push(path);
  }
}

// All dir entries that were unchecked.
function getRemovedDirs() {
  return prev_selected.filter((dir) => !selected.value.includes(dir));
}

// All dir entries that were newly checked.
function getNewDirs() {
  return selected.value.filter((dir) => !prev_selected.includes(dir));
}

function submitFolders() {
  const new_dirs = getNewDirs();
  const removed_dirs = getRemovedDirs();

  if (new_dirs.length == 0 && removed_dirs.length == 0) {
    emit("hideModal");
    return;
  }

  addRootDirs(new_dirs, removed_dirs)
    .then((res) => settings.setRootDirs(res))
    .then(() => emit("hideModal"));
}

function selectHere() {
  if (current == "$root" || current == "/") return;

  addRootDirs([current], [])
    .then((res) => settings.setRootDirs(res))
    .then(() => emit("hideModal"));
}

onMounted(() => {
  fetchDirs("$root");
  getRootDirs().then((_dirs) => {
    selected.value = _dirs;
    prev_selected.push(..._dirs);
  });
});
</script>

<style lang="scss">
.bread-nav {
  background-color: $gray4;
  padding: $smaller;
  padding-right: 0;
  width: max-content;
  margin-bottom: 1rem;
  position: absolute;
  top: -3.25rem;
  max-width: calc(100% - 2rem);
  max-width: 100%;
  overflow: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  display: flex;
  align-items: center;

  span {
    cursor: pointer;
  }
}

.bread-nav {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.bottom-text {
  position: absolute;
  font-size: small;
  bottom: -1.25rem;
  width: 100%;
  opacity: 0.5;
}

.set-root-dirs-browser {
  height: 27rem;
  margin-right: -1rem;

  display: grid;
  grid-template-rows: 1fr max-content;
  gap: 1.25rem;

  .folder_icon {
    vertical-align: 2px;
    margin-right: 4px;
  }

  .scrollable {
    overflow-x: hidden;
    height: 100%;
    padding-right: 1rem;
    padding: 1rem 1rem 1rem 0;

    .content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      gap: 1.5rem;
      overflow: hidden;
    }

    overflow-y: auto;
    scrollbar-gutter: stable;
    -webkit-overflow-scrolling: touch;
  }

  .buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: $medium;
    margin-right: 1rem;
    margin-bottom: -$medium;

    & > * {
      cursor: pointer;
      margin: 0;
    }

    button {
      font-weight: 500;
      padding: 0 1rem;
      font-variant-numeric: tabular-nums;
    }
  }

  .f-item {
    background-color: $gray5;
    transition: background-color 0.2s ease-out;

    &:hover {
      background-color: $gray3;
    }

    > svg {
      transition: color 0.2s ease-out;
    }
  }

  .f-item.selected {
    background-color: #234ece;
  }

  .f-item.selected > svg {
    color: $white;
  }
}
</style>
