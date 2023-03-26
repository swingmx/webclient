<template>
  <div class="f-container rounded">
    <div
      id="f-items"
      class="rounded"
      :class="{ 'list-mode': settings.folder_list_mode }"
    >
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

defineProps<{
  folders: Folder[];
}>();

const settings = useSettingsStore();
</script>

<style lang="scss">
#f-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1.5rem;
  padding-bottom: 1.25rem;
}

#f-items.list-mode {
  grid-template-columns: 1fr;
  gap: 0;

  .f-item {
    height: 3.25rem;
    border-radius: $small;
    background-color: transparent;

    .f-count {
      position: absolute;
      right: 1.25rem;
      bottom: 50%;
      translate: 0 50%;
    }
  }

  .f-item:hover {
    background-color: $gray !important;
  }
}
</style>

<!-- TODO: ADD BUTTON TO TOGGLE LIST MODE -->
