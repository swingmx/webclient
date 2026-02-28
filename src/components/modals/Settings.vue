<template>
    <div
        v-auto-animate
        class="settingsmodal"
        :class="{
            isSmallPhone,
        }"
    >
        <Sidebar
            v-if="!(isSmallPhone && showContent)"
            :current-group="(currentGroup as SettingGroup)"
            @set-tab="tab => (currentTab = tab)"
        />
        <div v-if="showContent" class="content">
            <div v-auto-animate class="head">
                <div class="h2">
                    <button v-if="isSmallPhone" class="back" @click="handleGoBack">
                        <ArrowSvg />
                    </button>
                    {{ currentGroup?.displayName || currentGroup?.title }}
                    <span v-if="currentGroup?.experimental" class="badge experimental circular">
                        {{ currentGroup?.experimental ? 'experimental' : '' }}
                    </span>
                </div>
                <div v-if="currentGroup?.desc" class="desc">
                    {{ currentGroup?.desc }}
                </div>
            </div>
            <Content :settings="(currentGroup as SettingGroup)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import settingGroups from '@/settings'

import ArrowSvg from '@/assets/icons/arrow.svg'
import { SettingGroup } from '@/interfaces/settings'
import { isSmallPhone } from '@/stores/content-width'
import { computed, ref } from 'vue'
import Content from './settings/Content.vue'
import Sidebar from './settings/Sidebar.vue'

const emit = defineEmits<{
    (e: 'setTitle', title: string): void
}>()

const currentTab = ref<string>('')
const currentGroup = computed(() => {
    for (const group of settingGroups) {
        for (const settings of group.groups) {
            if (settings.title === currentTab.value) {
                return settings
            }
        }
    }

    if (isSmallPhone.value) {
        return null
    }

    // select default tab
    for (const group of settingGroups) {
        for (const settings of group.groups) {
            if (settings.title === 'Appearance') {
                return settings
            }
        }
    }

    return null
})

const showContent = computed(() => {
    return currentGroup.value !== null
})

function handleGoBack() {
    currentTab.value = ''
}
</script>

<style lang="scss">
$modalheight: 38rem;

.settingsmodal {
    display: grid;
    grid-template-columns: 15rem 1fr;
    height: 100%;

    .content {
        display: grid;
        grid-template-rows: 4rem 1fr;

        .head {
            border-bottom: solid 1px $gray4;
            padding: 0 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;

            @include mediumPhones {
                padding: 0 1.75rem;
            }

            .h2 {
                margin: 0;
                font-size: 1.15rem;
                font-weight: bold;

                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .back {
                margin-left: -1rem;
                background-color: transparent;
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
            padding: 2px $smaller;
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

.settingsmodal.isSmallPhone {
    grid-template-columns: 1fr;

    .settingssidebar {
        border-right: none;
    }
}
</style>
