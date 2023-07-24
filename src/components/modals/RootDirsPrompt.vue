<template>
  <div class="root-dirs-prompt">
    <h3 class="t-center">Where do you want to look for music?</h3>
    <div class="options-group">
      <div
        class="option"
        v-for="option in options"
        :key="option.id"
        :class="{
          active: option.active,
        }"
        @click="option.action()"
        v-motion-slide-bottom
      >
        <b>{{ option.title }}</b>
        <div class="info">{{ option.info }}</div>
        <div class="check" v-if="option.active">✅</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
addRootDirs,
getRootDirs,
} from "@/requests/settings/rootdirs";
import useModalStore from "@/stores/modal";
import useSettingsStore from "@/stores/settings";
import { onMounted, ref } from "vue";

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
          title: "Home directory",
          info: "Scan all folders in your home directory.",
          active: settings.root_dirs[0] === "$home",
          delay: 0,
          action: () =>
            addRootDirs(["$home"], [])
              .then(() => settings.setRootDirs(["$home"]))
              .then(() => emit("hideModal")),
        },
        {
          id: "wtf",
          title: "Customize root directories",
          info: "Select folders to scan for music.",
          delay: 0.1,
          action: () => modal.showSetRootDirsModal(),
          active:
            settings.root_dirs[0] !== "$home" &&
            settings.root_dirs[0] !== undefined,
        },
      ];
    });
});
</script>

<style lang="scss">
.root-dirs-prompt {
  height: 14rem;

  .option.active {
    background-color: #3f6bac38;
  }

  .option {
    padding: 1.25rem;
    border-radius: $small;
    position: relative;
    background-color: #4e4b4b3f;
    margin-top: 1.25rem;
    cursor: pointer;

    &:hover {
      background-color: $darkblue;
    }

    .info {
      margin-top: $smaller;
      font-size: small;
    }

    .check {
      position: absolute;
      right: 1.25rem;
      top: 0;
      bottom: 0;
      margin: auto;
      height: max-content;
    }
  }
}
</style>
