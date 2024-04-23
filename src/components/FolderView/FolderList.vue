<template>
  <div
    class="f-container rounded-sm"
    :class="{
      'list-mode': isSmallestPhone ? true : settings.folder_list_mode,
    }"
  >
    <div id="f-items" class="rounded">
      <FolderItem v-for="folder in folders" :key="folder.path" :folder="folder" :folder_page="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Folder } from "@/interfaces";
import { isSmallestPhone } from "@/stores/content-width";
import useSettingsStore from "@/stores/settings";
import FolderItem from "./FolderItem.vue";

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
  background-color: $gray4;
}

.f-container.list-mode > #f-items {
  grid-template-columns: 1fr;
  gap: 0;

  .f-item {
    line-height: 1.2;
    transition: none;
    height: 3.25rem;
    border-radius: $small;
    background-color: transparent;
    padding-left: $small;
    transition: background-color 0.2s ease-out;

    .options {
      display: block;
      background-color: transparent !important;
    }

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: $medium;
    }

    &:hover {
      background-color: $gray !important;
    }
  }
}
</style>
