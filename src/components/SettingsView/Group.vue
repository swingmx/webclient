<template>
    <div v-if="group && (group.show_if ? group.show_if() : true)" class="settingsgroup">
        <!-- <div v-if="group.title || group.desc" class="info">
      <h4 v-if="group.title">
        {{ group.title
        }}<span v-if="group.experimental" class="badge experimental circular">
          {{ group.experimental ? "experimental" : "" }}
        </span>
      </h4>
      <div v-if="group.desc" class="desc">{{ group.desc }}</div>
    </div> -->
        <div class="setting pad-lg">
            <div
                v-for="(setting, index) in group.settings.filter(s => (s.show_if ? s.show_if() : true))"
                :key="index"
                class="setting-item"
                :class="{
                    inactive: setting.inactive && setting.inactive(),
                    'is-list': setting.type === SettingType.root_dirs,
                }"
            >
                <div class="text" @click="setting.defaultAction ? setting.defaultAction() : setting.action()">
                    <div class="title">
                        <span class="ellip">
                            {{ setting.title }}
                            <span v-if="setting.experimental" class="badge experimental circular">
                                {{ setting.experimental ? "experimental" : "" }}
                            </span>
                            <span v-if="setting.new" class="badge new circular">
                                {{ setting.new ? "new" : "" }}
                            </span>
                        </span>
                        <button v-if="setting.type == SettingType.root_dirs" @click="setting.action">
                            <ReloadSvg /> rescan
                        </button>
                    </div>
                    <div v-if="setting.desc" class="desc">
                        {{ setting.desc }}
                    </div>
                </div>
                <div class="options">
                    <Switch
                        v-if="setting.type == SettingType.binary"
                        :state="setting.state && setting.state()"
                        @click="setting.action()"
                    />
                    <Select
                        v-if="setting.type === SettingType.select"
                        :options="setting.options"
                        :source="setting.state !== null ? setting.state : () => ''"
                        :setter-fn="setting.action"
                    />
                    <button v-if="setting.type === SettingType.button" @click="setting.action">
                        {{ setting.button_text && setting.button_text() }}
                    </button>
                    <LockedNumberInput
                        v-if="setting.type == SettingType.locked_number_input"
                        :value="setting.state !== null ? setting.state() : 0"
                        :min="0"
                        :max="10"
                        :step="1"
                        :unit="'s'"
                        :on-change="setting.action"
                    />
                </div>

                <!-- Custom components -->
                <List
                    v-if="setting.type === SettingType.root_dirs"
                    icon="folder"
                    :items="setting.state !== null ? setting.state() : []"
                />
                <SeparatorsInput
                    v-if="setting.type === SettingType.separators_input && setting.action"
                    :submit="setting.action"
                    :default="setting.state ? setting.state() : []"
                />
                <Profile v-if="setting.type === SettingType.profile" />
                <Accounts v-if="setting.type === SettingType.accounts" />
                <About v-if="setting.type === SettingType.about" />
                <Pairing v-if="setting.type === SettingType.pairing" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SettingGroup } from "@/interfaces/settings";
import { SettingType } from "@/settings/enums";

import ReloadSvg from "@/assets/icons/reload.svg";
import List from "./Components/List.vue";
import LockedNumberInput from "./Components/LockedNumberInput.vue";
import Select from "./Components/Select.vue";
import SeparatorsInput from "./Components/SeparatorsInput.vue";
import Switch from "./Components/Switch.vue";

import About from "./About.vue";
import Profile from "../modals/settings/Profile.vue";
import Pairing from "../modals/settings/custom/Pairing.vue";
import Accounts from "../modals/settings/custom/Accounts.vue";

defineProps<{
    group: SettingGroup;
}>();
</script>

<style lang="scss">
.settingsgroup {
    display: grid;
    gap: $small;
    margin-top: 2rem;
    padding-bottom: 2rem;

    &:first-child {
        margin-top: 0;
    }

    .info {
        margin-left: $smaller;
        margin-bottom: $small;
    }

    h4 {
        margin: $small auto;
    }

    .desc {
        opacity: 0.5;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .setting {
        // background-color: $gray;

        @include mediumPhones {
            padding: 1rem $small;
        }

        .inactive {
            opacity: 0.5;
            pointer-events: none;
        }
    }

    .setting > * {
        display: grid;
        grid-template-columns: 1fr max-content;
        gap: $small;

        @include smallPhones {
            display: flex;
            flex-wrap: wrap;
        }
    }

    .setting-item {
        user-select: none;
        border-bottom: solid 1px $gray5;
        padding: 1.25rem 0;

        .options {
            margin: auto 0;
        }

        .text {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: self-start;
            width: 100%;

            .title {
                font-weight: 500;
                margin: auto 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: $small;
                width: 100%;

                button > svg {
                    transform: scale(0.65);
                }
            }

            .desc {
                margin-top: $smaller;
            }
        }
    }

    .setting-item:first-child {
        padding-top: 0;
    }

    .setting-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    @include smallerPhones {
        .info ~ .setting > .setting-item {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: $small;
        }
    }
}
</style>
