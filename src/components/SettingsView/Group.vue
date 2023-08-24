<template>
  <div class="settingsgroup">
    <div v-if="group.title || group.desc" class="info">
      <h4 v-if="group.title">{{ group.title }}</h4>
      <div v-if="group.desc" class="desc">{{ group.desc }}</div>
    </div>
    <div class="setting rounded pad-lg">
      <div
        v-for="(setting, index) in group.settings"
        :key="index"
        class="setting-item"
        :class="{
          inactive: setting.inactive && setting.inactive(),
          'is-list': setting.type === SettingType.list,
        }"
      >
        <div
          class="text"
          @click="
            setting.defaultAction ? setting.defaultAction() : setting.action()
          "
        >
          <div class="title ellip">
            {{ setting.title }}
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
          <button
            v-if="setting.type === SettingType.button"
            @click="setting.action"
          >
            {{ setting.button_text && setting.button_text() }}
          </button>
        </div>

        <List
          v-if="setting.type === SettingType.list"
          icon="folder"
          :items="setting.state !== null ? setting.state() : []"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SettingType } from "@/settings/enums";
import { SettingGroup } from "@/interfaces/settings";

import Switch from "./Components/Switch.vue";
import Select from "./Components/Select.vue";
import List from "./Components/List.vue";

defineProps<{
  group: SettingGroup;
}>();
</script>

<style lang="scss">
.settingsgroup {
  display: grid;
  // grid-template-columns: 20rem 1fr;
  gap: $small;
  margin-top: 2rem;
  border-bottom: solid 1px $gray;
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
  }

  .setting {
    background-color: $gray;
    // display: grid;
    // gap: 1rem;

    .inactive {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .setting > * {
    display: grid;
    grid-template-columns: 1fr max-content;
  }

  .setting-item {
    user-select: none;
    border-bottom: solid 1px $gray5;
    padding: $medium 0;

    .options {
      margin: auto 0;
    }

    .text {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: self-start;

      .title {
        margin: auto 0;
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
}
</style>
