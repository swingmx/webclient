<template>
  <div id="right-tabs" :class="{ tabContent: tabContent }">
    <div class="tabheaders">
      <button
        class="tab circular"
        v-for="tab in tabs"
        :key="tab"
        @click="$emit('switchTab', tab)"
        :class="{ activetab: tab === currentTab }"
      >
        {{ tab }}
      </button>
    </div>

    <div id="tab-content" v-auto-animate v-if="tabContent">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: string[];
  currentTab: string;
  tabContent?: boolean;
}>();

defineEmits<{
  (e: "switchTab", tab: string): void;
}>();
</script>

<style lang="scss">
#right-tabs {
  display: grid;
  position: absolute; // TODO: Find a way to fix scrollability without using position absolute.
  overflow: hidden;

  height: 100%;
  width: 100%;

  .tab-buttons-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

#tab-content {
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
}

#right-tabs.tabContent {
  grid-template-rows: min-content 1fr;
}
</style>
