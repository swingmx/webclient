<template>
  <div class="root-dirs-prompt">
    <h3 class="t-center">{{ $t('RootDirsPrompt.WhereToLook') }}</h3>
    <div class="options-group">
      <div v-for="option in options" :key="option.id" v-motion-slide-bottom class="option" @click="option.action()">
        <b>{{ option.title }}</b>
        <div class="info">{{ option.info }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { addRootDirs, getRootDirs } from "@/requests/settings/rootdirs";
import useModalStore from "@/stores/modal";
import useSettingsStore from "@/stores/settings";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const settings = useSettingsStore();

const modal = useModalStore();
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();

const root_dirs: string[] = [];
const options = ref<any[]>([]);

onMounted(() => {
  getRootDirs()
    .then((res) => root_dirs.push(...res))
    .then(() => {
      settings.setRootDirs(root_dirs);

      options.value = [
        {
          id: "$home",
          title: t('RootDirsPrompt.HomeDir'),
          info: t('RootDirsPrompt.HomeDirInfo'),
          delay: 0,
          action: () =>
            addRootDirs(["$home"], [])
              .then(() => settings.setRootDirs(["$home"]))
              .then(() => emit("hideModal")),
        },
        {
          id: "wtf",
          title: t('RootDirsPrompt.SpecificDir'),
          info: t('RootDirsPrompt.SpecificDirInfo'),
          delay: 0.1,
          action: () => modal.showSetRootDirsModal(),
        },
      ];
    });
});
</script>

<style lang="scss">
.root-dirs-prompt {
  .option {
    padding: 1.25rem;
    border-radius: $small;
    position: relative;
    background-color: #4e4b4b3f;
    margin-top: 1.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease-out;

    &:hover {
      background-color: $darkblue;
    }

    .info {
      margin-top: $smaller;
      font-size: small;
      font-weight: 500;
    }
  }
}
</style>
