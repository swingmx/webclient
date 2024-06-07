<template>
    <div class="settingssidebar">
        <div class="groups">
            <div
                class="group"
                v-for="group in settingGroups.filter(g => {
                    // return true
                    return g.show_if ? g.show_if() : true;
                })"
                :key="group.title"
            >
                <div class="gtitle" v-if="group.title">
                    {{ group.title }}
                </div>
                <div class="gitems">
                    <div
                        class="gitem rounded-sm"
                        v-for="item in group.groups"
                        :key="item.title"
                        :class="{
                            active: currentGroup && item.title === currentGroup.title,
                            about: item.title === 'About',
                        }"
                        @click="() => $emit('setTab', item.title || '')"
                    >
                        <Avatar :size="18" :name="auth.user.username || ''" v-if="item.title === 'Profile'" />
                        <span class="icon" v-html="item.icon" v-else></span>
                        <span>
                            {{ item.title }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SettingGroup } from "@/interfaces/settings";
import settingGroups from "@/settings";
import useAuth from "@/stores/auth";

import Avatar from "@/components/shared/Avatar.vue";

const auth = useAuth();

defineProps<{
    currentGroup: SettingGroup;
}>();

defineEmits<{
    (e: "setTab", title: string): void;
}>();
</script>

<style lang="scss">
.settingssidebar {
    border-right: solid 1px $gray4;
    background-color: $gray;
    padding: 1.5rem;

    display: grid;
    grid-template-rows: 1fr max-content;
    user-select: none;

    overflow: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    max-height: calc(100vh - 4rem);

    @include allPhones {
        max-height: calc(100vh - 2rem);
    }

    @include largePhones {
        padding: 1rem;
    }

    .groups {
        display: flex;
        flex-direction: column;

        .group {
            &:first-child {
                .gitems {
                    .gitem {
                        margin-top: 0;
                    }
                }
            }
        }
    }

    .appversion {
        pointer-events: none;
        font-size: 12px;
        padding: 0 $small;
        color: $gray1;
    }

    .gtitle {
        font-weight: bold;
        font-size: 14px;
        margin: 1rem 0 $smaller $small;
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
        margin-top: $smaller;
        position: relative;
        transition: background-color 0.2s ease-out, color 0.2s ease-out;

        @include largePhones {
            padding: 0.551rem;
        }

        svg {
            width: 1.25rem;
            transition: color 0.2s ease-out;
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

        &.about {
            margin-top: 14px;
        }

        &.about::before {
            content: "";
            height: 1px;
            position: absolute;
            top: -$small;
            left: 0;

            background-color: $gray5;
            width: 100%;
        }
    }
}
</style>
