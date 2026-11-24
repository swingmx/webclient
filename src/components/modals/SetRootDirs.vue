<template>
  <div class="m-dialog set-root-dirs">
    <div class="m-body">
      <div id="bread-nav" class="bread-nav rounded-sm">
        &nbsp;&nbsp;<span @click="fetchDirs('$root')">$root</span>&nbsp;&nbsp;<BreadCrumbNav
          :sub-paths="subPaths"
          @navigate="fetchDirs"
        />
      </div>
      <div class="set-root-dirs-browser">
        <h4 v-if="no_more_dirs">
          <span class="folder_icon">📂</span> {{ $t('SetRootDirs.NoSubFolders') }}
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
      </div>
    </div>
    <footer class="m-footer">
      <button class="m-btn secondary" @click="selectHere">{{ $t('SetRootDirs.SelectThisFolder') }}</button>
      <button class="m-btn primary" @click="submitFolders">
        {{ $t('SetRootDirs.AddAllChecked') }} ({{ getNewDirs().length }})
      </button>
    </footer>
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
      const res = createSubPaths(path, oldpath);
      oldpath = res[0];
      subPaths.value = res[1];
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
.set-root-dirs {
  .m-body {
    gap: 12px;
  }

  .bread-nav {
    background-color: $gray5;
    padding: $smaller;
    padding-right: 0;
    width: max-content;
    max-width: 100%;
    overflow: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    display: flex;
    align-items: center;

    span {
      cursor: pointer;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.set-root-dirs-browser {
  height: 27rem;
  display: flex;
  flex-direction: column;

  .folder_icon {
    vertical-align: 2px;
    margin-right: 4px;
  }

  .scrollable {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
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
    background-color: $darkestblue;
  }

  .f-item.selected > svg {
    color: $white;
  }
}
</style>
