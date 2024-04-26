<template>
    <div class="settingssidebar">
        <div class="groups">
            <div
                class="group"
                v-for="group in settingGroups"
                :key="group.title"
            >
                <div
                    class="gtitle"
                    v-if="group.title"
                >
                    {{ group.title }}
                </div>
                <div class="gitems">
                    <div
                        class="gitem rounded-sm"
                        v-for="item in group.groups"
                        :key="item.title"
                        :class="{
                            active: item.title === currentGroup.title,
                        }"
                        @click="() => $emit('setTab', item.title || '')"
                    >
                        <!-- <DummySvg /> -->
                        <Avatar
                            :size="18"
                            :name="auth.user.username"
                            v-if="item.title === 'Profile'"
                        />
                        <span
                            class="icon"
                            v-html="item.icon"
                            v-else
                        ></span>
                        <span>
                            {{ item.title }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="appversion">Swing Music v2.0.0</div>
    </div>
</template>

<script setup lang="ts">
import useAuth from '@/stores/auth'
import settingGroups from '@/settings'
import { SettingGroup } from '@/interfaces/settings'

import Avatar from '@/components/shared/Avatar.vue'

const auth = useAuth()

defineProps<{
    currentGroup: SettingGroup
}>()

defineEmits<{
    (e: 'setTab', title: string): void
}>()
</script>

<style lang="scss">
.settingssidebar {
    border-right: solid 1px $gray4;
    background-color: $gray;
    padding: 1.5rem;

    display: grid;
    grid-template-rows: 1fr max-content;

    .appversion {
        pointer-events: none;
        font-size: 12px;
        padding: 0 $small;
        color: $gray1;
    }

    .gtitle {
        font-weight: bold;
        font-size: 14px;
        margin: $medium 0 $small $small
    }

    .gitems {
        display: flex;
        flex-direction: column;
    }

    .gitem {
        padding: $small;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: $medium;
        color: rgb(156, 156, 156);
        font-weight: 500;
        font-size: 14px;

        svg {
            width: 1.25rem;
        }

        .icon {
            height: 1.25rem;
        }

        &:hover {
            background-color: $gray5;
        }

        &.active {
            background-color: $gray5;
            color: $white;
            font-weight: bold;

            svg {
                color: $white;
            }
        }
    }
}
</style>
