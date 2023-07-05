<template>
  <div
    class="f-container rounded-sm"
    :class="{
      'list-mode': isIphoneSE ? true : settings.folder_list_mode,
    }"
  >
    <div id="f-items" class="rounded">
      <FolderItem
        v-for="folder in folders"
        :key="folder.path"
        :folder="folder"
        :folder_page="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Folder } from "@/interfaces";
import FolderItem from "./FolderItem.vue";
import useSettingsStore from "@/stores/settings";
import { isIphoneSE } from "@/stores/content-width";

defineProps<{
  folders: Folder[];
}>();

const settings = useSettingsStore();
</script>

<style lang="scss">
.f-container {
  padding-bottom: 1.25rem;
}

#f-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1.5rem;
}

.f-item:hover {
  // cursor: pointer;
  background-color: $gray5;
}

.f-container.list-mode > #f-items {
  grid-template-columns: 1fr;
  gap: 0;
  // border: solid 1px $gray;
  // padding: 1rem;

  .f-item {
    transition: none;
    height: 3.25rem;
    border-radius: $small;
    background-color: transparent;

    .f-count {
      position: absolute;
      right: 1.25rem;
      bottom: 50%;
      translate: 0 50%;
    }

    &:hover {
      background-color: $gray !important;
    }
  }
}
</style>

<!-- TODO: ADD BUTTON TO TOGGLE LIST MODE -->
