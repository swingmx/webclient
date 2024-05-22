<template>
    <div class="settingsmodalcontent">
        <Group :group="settings" />
    </div>
</template>

<script setup lang="ts">
import Group from "@/components/SettingsView/Group.vue";
import { SettingGroup } from "@/interfaces/settings";

defineProps<{
    settings: SettingGroup;
}>();
</script>

<style lang="scss">
.settingsmodalcontent {
    width: 100%;
    padding: 0 1rem;
    height: 100%;
    max-height: calc(100vh - 6.85rem);
    overflow: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    -webkit-overflow-scrolling: touch;

    @include allPhones {
        max-height: calc(100vh - 4.85rem);
    }
}
</style>
