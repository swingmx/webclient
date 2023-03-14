<template>
  <div class="list-items">
    <div class="option-list-item" v-for="i in items" :key="i.title">
      <div class="with-icon">
        <component :is="icon" />
        <div class="text ellip">
          {{ i.title }}
        </div>
      </div>
      <div class="icon" @click="i.action">
        <span>{{ i.buttontext }}</span>
      </div>
    </div>
    <div v-if="!items.length" class="option-list-item" style="opacity: 0.5">
      Root directories not configured. Use the "modify" button above to
      configure
    </div>
  </div>
</template>

<script setup lang="ts">
import FolderSvg from "../../../assets/icons/folder.svg";

const props = defineProps<{
  items: {
    title: string;
    buttontext: string;
    action: () => void;
  }[];
  icon: "folder";
}>();

function getIcon() {
  switch (props.icon) {
    case "folder":
      return FolderSvg;

    default:
      return FolderSvg;
  }
}

console.log(props.icon);

const icon = getIcon();
</script>

<style lang="scss">
.setting-item.is-list {
  $color: $gray5;

  .list-items {
    background-color: $color;
    border-radius: $small;
    margin-top: 1rem;
    overflow: hidden;
    padding: 1rem 0;
  }

  .option-list-item {
    padding: $small 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    .with-icon {
      display: flex;
      gap: $small;
      align-items: center;
      font-family: "SF Mono", monospace;
      font-size: 0.9rem;
    }

    &:hover {
      background-color: $gray4;
    }

    span {
      color: white;
      cursor: pointer;
      background-color: $red;
      padding: $smaller $small;
      border-radius: 6px;
      z-index: 20;
    }
  }
}
</style>
