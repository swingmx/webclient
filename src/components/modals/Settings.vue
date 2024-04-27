<template>
    <div class="settingsmodal">
        <Sidebar
            :current-group="(currentGroup as SettingGroup)"
            @set-tab="setTab"
        />
        <div class="content">
            <div
                class="head"
                v-auto-animate
            >
                <div class="h2">
                    {{ currentGroup?.title }}
                    <span
                        v-if="currentGroup?.experimental"
                        class="badge experimental circular"
                    >
                        {{ currentGroup?.experimental ? 'experimental' : '' }}
                    </span>
                </div>
            </div>
            <Content :settings="(currentGroup as SettingGroup)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import settingGroups from '@/settings'

import Content from './settings/Content.vue'
import Sidebar from './settings/Sidebar.vue'
import { computed, ref } from 'vue'
import { SettingGroup } from '@/interfaces/settings'

const emit = defineEmits<{
    (e: 'setTitle', title: string): void
}>()

const currentTab = ref<string>('')

function setTab(title: string) {
    currentTab.value = title
}

const currentGroup = computed(() => {
    for (const group of settingGroups) {
        for (const settings of group.groups) {
            if (settings.title === currentTab.value) {
                return settings
            }
        }
    }

    for (const group of settingGroups) {
        for (const settings of group.groups) {
            if (settings.title === 'Appearance') {
                return settings
            }
        }
    }
})
// onMounted(() => {
//   emit("setTitle", "Settings");
// });
</script>

<style lang="scss">
$modalheight: 35rem;

.settingsmodal {
    display: grid;
    grid-template-columns: 15rem 1fr;
    height: $modalheight;

    .content {
        display: grid;
        grid-template-rows: 4rem 1fr;
        height: $modalheight;

        .head {
            border-bottom: solid 1px $gray4;
            padding: 0 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .h2 {
                margin: 0;
                font-size: 1.15rem;
                font-weight: bold;
            }

            .desc {
                opacity: 0.5;
                font-size: 0.8rem;
            }
        }
    }


    // Role badges used in Profile and Accounts tabs
    .roles {
        display: flex;
        gap: $small;

        .role {
            // margin: $smaller $small 0 0;
            padding: 3px $smaller;
            border-radius: $smaller;
            border: solid 1px $brown;
            color: $brown;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;

            display: flex;
            align-items: center;
            gap: $small;
        }
    }
}
</style>
