<template>
    <div class="settingsmodalcontent">
        <Group :group="settings"/>
    </div>
</template>

<script setup lang="ts">
import { SettingGroup } from '@/interfaces/settings';
import Group from '@/components/SettingsView/Group.vue';

defineProps<{
    settings: SettingGroup
}>();
</script>

<style lang="scss">
.settingsmodalcontent {
    width: 100%;
    padding: 0 1rem;
    height: 100%;
    overflow: auto;
    scrollbar-gutter: stable;
}
</style>
