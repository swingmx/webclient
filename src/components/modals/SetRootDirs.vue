<template>
  <br /><br />
  <div style="position: relative">
    <div class="bread-nav rounded-sm">
      &nbsp;&nbsp; 📁 &nbsp;&nbsp;<BreadCrumbNav
        :subPaths="subPaths"
        @navigate="fetchDirs"
      />
    </div>
    <div class="set-root-dirs-browser">
      <button class="circular btn-active" @click="submitFolders">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Finish
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </button>
      <div class="no-scroll">
        <FolderItem
          v-for="dir in dirs"
          :key="dir.name"
          :folder="dir"
          @navigate="fetchDirs(dir.path)"
          @check="handleCheck(dir.path)"
          :is_checked="
            selected.filter((p) => p == dir.path).length > 0 ? true : false
          "
        />
      </div>
      <h3 v-if="no_more_dirs">No folders here 😶</h3>
    </div>
    <div class="bottom-text t-center">
      Select the <b><u>main</u> </b> folder(s) where your music files are stored.
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getFolders,
  addRootDirs,
  getRootDirs,
} from "@/composables/fetch/settings/rootdirs";
import { Folder, subPath } from "@/interfaces";
import { createSubPaths } from "@/utils";
import { onMounted, Ref, ref } from "vue";
import BreadCrumbNav from "../FolderView/BreadCrumbNav.vue";
import FolderItem from "../FolderView/FolderItem.vue";

const dirs: Ref<Folder[]> = ref([]);
const no_more_dirs = ref(false);
const selected = ref<string[]>([]);

const subPaths = ref<subPath[]>([]);

const prev_selected: string[] = [];

let oldpath = "$home";

const emit = defineEmits<{
  (e: "hideModal"): void;
}>();

function fetchDirs(path: string) {
  getFolders(path).then((folders) => {
    dirs.value = folders;
    no_more_dirs.value = folders.length == 0;

    [oldpath, subPaths.value] = createSubPaths(path, oldpath);
  });
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

  addRootDirs(new_dirs, removed_dirs)
  .then(() => emit("hideModal"));
}

onMounted(() => {
  fetchDirs("$home");
  getRootDirs().then((_dirs) => {
    selected.value = _dirs;
    prev_selected.push(..._dirs);
  });
});
</script>

<style lang="scss">
.bread-nav {
  background-color: $gray4;
  padding: $small;
  width: max-content;
  margin-bottom: 1rem;
  position: absolute;
  top: -3.25rem;
  max-width: calc(100% - 12rem);
  overflow-x: scroll;
  scrollbar-width: none;
  display: grid;
  grid-template-columns: max-content 1fr;

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
  height: 34rem;
  overflow: scroll;
  overflow-x: hidden;
  padding-right: 1rem;
  scrollbar-gutter: stable;
  margin-right: -1rem;

  button {
    height: 2.15rem;
    position: absolute;
    right: 2rem;
    top: -3.15rem;
  }

  & > div {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1.5rem;
  }

  .f-item {
    background-color: $gray3;

    &:hover {
      background-color: $brown;
    }
  }
}
</style>
